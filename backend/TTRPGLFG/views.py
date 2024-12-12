from django.contrib.admin.options import json
from django.http import JsonResponse
from django.core.serializers import serialize
from django.views.decorators.http import require_GET, require_POST, require_http_methods
from TTRPGLFG.models import User, Group, Game, Application, Belongsto, Session, Tag, Grouptag, Usertag, Schedule, Chat, Chatmessage
from datetime import datetime

#####################################################
# Helper function
#####################################################


def modelAsJson(model):
    return json.loads(serialize("json", model))


#####################################################
# endpoints
#####################################################


@require_POST
def createUser(request):
    if not request.body:
        return JsonResponse({'status': 'error', 'message': 'No data provided'}, status=400)

    try:
        json_data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
    
    #if not json_data or not hasattr(json_data, 'username') or not json_data['username']:
    #    return JsonResponse({'status': 'error', 'message': 'Wrong JSON format'}, status=400)
    
    if (User.objects.filter(username=json_data['username']).exists()):
        return JsonResponse({'status': 'error', 'message': 'User already exists'}, status=409)

    field_names = [
        field.name for field in User._meta.fields if field.name != 'id']
    missing_fields = [field for field in field_names if field not in json_data]
    if (missing_fields):
        return JsonResponse({'status': 'error', 'message': 'Missing fields', "fields": missing_fields}, status=400)

    user = User()
    for key in json_data:
        setattr(user, key, json_data[key])

    try:
        user.save()
    except Exception:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON data'}, status=400)

    return JsonResponse({'status': 'success'})


@require_GET
def getDMUsers(request):
    users = User.objects.filter(candm=True)
    result_users = modelAsJson(users)
    result = {'status': 'success', 'data': result_users}
    return JsonResponse(result)


@require_POST
def createGroup(request):
    if not request.body:
        return JsonResponse({'status': 'error', 'message': 'No data provided'}, status=400)

    try:
        json_data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)

    if not json_data or not 'name' in json_data or not json_data['name']:
        return JsonResponse({'status': 'error', 'message': 'Wrong JSON format'}, status=400)

    if (Group.objects.filter(name=json_data['name']).exists()):
        return JsonResponse({'status': 'error', 'message': 'Group already exists'}, status=409)
    
    field_names = [
        field.name for field in Group._meta.fields if field.name != 'id']
    missing_fields = [field for field in field_names if field not in json_data]
    if (missing_fields):
        return JsonResponse({'status': 'error', 'message': 'Missing fields', "fields": missing_fields}, status=400)

    group = Group()
    for key in json_data:
        if (key == 'gameid'):
            setattr(group, key, Game.objects.get(id=json_data[key]))
            continue
        setattr(group, key, json_data[key])

    try:
        group.save()
    except Exception:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON data'}, status=400)
    
    chat = Chat()
    setattr(chat, 'groupid', group)
    setattr(chat, 'chattype', 'GRP')

    try:
        chat.save()
    except Exception:
        return JsonResponse({'status': 'error', 'message': 'Chat failed to create'}, status=400)

    return JsonResponse({'status': 'success'})


@require_GET
def getGroupByGame(request, game: int):
    group = Group.objects.filter(gameid=Game.objects.get(id=game))
    if not group:
        return JsonResponse({'error': 'Group not found'}, status=404)

    result_list = modelAsJson(group)
    result = {'status': 'success', 'data': result_list}
    return JsonResponse(result)


@require_POST
def createGame(request):
    if not request.body:
        return JsonResponse({'status': 'error', 'message': 'No data provided'}, status=400)

    try:
        json_data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)

    if not json_data or not 'name' in json_data or not json_data['name']:
        return JsonResponse({'status': 'error', 'message': 'Wrong JSON format'}, status=400)

    if (Game.objects.filter(name=json_data['name']).exists()):
        return JsonResponse({'status': 'error', 'message': 'Game already exists'}, status=409)

    field_names = [
        field.name for field in Game._meta.fields if field.name != 'id']
    missing_fields = [field for field in field_names if field not in json_data]
    if (missing_fields):
        return JsonResponse({'status': 'error', 'message': 'Missing fields', "fields": missing_fields}, status=400)

    game = Game()
    for key in json_data:
        setattr(game, key, json_data[key])

    try:
        game.save()
    except Exception:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON data'}, status=400)

    return JsonResponse({'status': 'success'})


@require_GET
def getGroupByLanguage(request, languages: str):
    group = Group.objects.filter(languages=languages)

    result_groups = modelAsJson(group)
    result = {'status': 'success', 'data': result_groups}
    return JsonResponse(result)


@require_GET
def getGroupWithoutDM(request):
    group = Group.objects.filter(dmneeded=True)

    result_groups = modelAsJson(group)
    result = {'status': 'success', 'data': result_groups}
    return JsonResponse(result)


@require_POST
def acceptApplication(request, application_id: int):
    application = Application.objects.get(id=application_id)
    if not application:
        return JsonResponse({'error': 'Application not found'}, status=404)

    group = Group.objects.get(id=application.groupid)
    user = User.objects.get(id=application.applicantid)
    Belongsto.objects.create(userid=user, groupid=group, isowner=False)

    return JsonResponse({'status': 'success'})


@require_POST
def denyApplication(request, application_id: int):
    application = Application.objects.get(id=application_id)
    if not application:
        return JsonResponse({'error': 'Application not found'}, status=404)

    application.delete()

    return JsonResponse({'status': 'success'})

##########################
# Autor: Petr Plíhal
#
##########################

@require_POST
def kickPlayer(request):
    try:
        json_data = json.loads(request.body)
        group_id = json_data.get('group_id')
        user_id = json_data.get('user_id')
        
        group = Group.objects.get(id=group_id)
        user = User.objects.get(id=user_id)
        membership = Belongsto.objects.get(groupid=group, userid=user)

        membership.delete()
        return JsonResponse({'status': 'success', 'message': f'User {user_id} kicked from group {group_id}'})
    
    except Group.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Group {group_id} not found'}, status=404)
    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'User {user_id} not found'}, status=404)
    except Belongsto.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Membership of user {user_id} and group {group_id} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)

@require_POST
def invitePlayer(request):
    try:
        json_data = json.loads(request.body)
        group_id = json_data.get('group_id')
        user_id = json_data.get('user_id')
        description = json_data.get('description', '')  # Default to an empty string if not provided
        
        group = Group.objects.get(id=group_id)
        user = User.objects.get(id=user_id)

        # Check if user is already a member of the group
        if Belongsto.objects.filter(groupid=group, userid=user).exists():
            return JsonResponse({'status': 'info', 'message': f'User {user_id} is already a member of group {group_id}'})
        
        # Check if user already has an application for this group
        if Application.objects.filter(groupid=group, applicantid=user).exists():
            return JsonResponse({'status': 'info', 'message': f'User {user_id} already has an application for group {group_id}'})
        
        Application.objects.create(groupid=group, applicantid=user, description=description)
        return JsonResponse({'status': 'success', 'message': f'Application created for user {user_id} to join group {group_id}'})
    
    except Group.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Group {group_id} not found'}, status=404)
    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'User {user_id} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)

@require_POST
def applyToGroup(request):
    try:
        json_data = json.loads(request.body)
        group_id = json_data.get('group_id')
        user_id = json_data.get('user_id')
        description = json_data.get('description', '') # Defaults to an empty string if not provided
        
        group = Group.objects.get(id=group_id)
        user = User.objects.get(id=user_id)

        # Check if user is already a member of the group
        if Belongsto.objects.filter(groupid=group, userid=user).exists():
            return JsonResponse({'status': 'info', 'message': f'User {user_id} is already a member of group {group_id}'})
        
        # Check if user already has an application for this group
        if Application.objects.filter(groupid=group, applicantid=user).exists():
            return JsonResponse({'status': 'info', 'message': f'User {user_id} already has an application for group {group_id}'})

        Application.objects.create(groupid=group, applicantid=user, description=description)
        
        chat = Chat()
        setattr(chat, 'applicationid', Application.objects.get(applicantid=user, groupid=group))
        setattr(chat, 'chattype', 'APP')

        chat.save()
        
        return JsonResponse({'status': 'success', 'message': f'User {user_id} applied to group {group_id}'})
    
    except Group.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Group {group_id} not found'}, status=404)
    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'User {user_id} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)

@require_POST
def cancelApplication(request):
    try:
        json_data = json.loads(request.body)
        group_id = json_data.get('group_id')
        user_id = json_data.get('user_id')
        
        group = Group.objects.get(id=group_id)
        user = User.objects.get(id=user_id)
        application = Application.objects.get(groupid=group, applicantid=user)

        application.delete()
        return JsonResponse({'status': 'success', 'message': f'Application of user {user_id} to group {group_id} cancelled'})
    
    except Group.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Group {group_id} not found'}, status=404)
    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'User {user_id} not found'}, status=404)
    except Application.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Application of user {user_id} to group {group_id} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)

@require_GET
def getGroupSessions(request, group_id):
    try:
        group = Group.objects.get(id=group_id)
        sessions = Session.objects.filter(groupid=group)
        sessions_data = modelAsJson(sessions)

        return JsonResponse({'status': 'success', 'data': sessions_data})
    
    except Group.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Group {group_id} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)

@require_POST
def addGroupTags(request):
    try:
        json_data = json.loads(request.body)
        group_id = json_data.get('group_id')
        tag_ids = json_data.get('tag_ids')
        
        group = Group.objects.get(id=group_id)
        
        # Check if all tags exist
        tags = Tag.objects.filter(id__in=tag_ids)
        if tags.count() != len(tag_ids):
            return JsonResponse({'status': 'error', 'message': 'One or more tags not found'}, status=404)
        
        # Add tags to group only if they don't already exist
        added_tags = []
        for tag in tags:
            if not Grouptag.objects.filter(groupid=group, tagid=tag).exists():
                Grouptag.objects.create(groupid=group, tagid=tag)
                added_tags.append(tag.id)
        
        if added_tags:
            return JsonResponse({'status': 'success', 'message': f'Tags {added_tags} added to group {group_id}'})
        else:
            return JsonResponse({'status': 'info', 'message': f'No new tags were added, all tags already exist for group {group_id}'})

    except Group.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Group {group_id} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)

@require_POST
def removeGroupTags(request):
    try:
        json_data = json.loads(request.body)
        group_id = json_data.get('group_id')
        tag_ids = json_data.get('tag_ids')
        
        group = Group.objects.get(id=group_id)
        
        # Check if all tags exist
        tags = Tag.objects.filter(id__in=tag_ids)
        if tags.count() != len(tag_ids):
            return JsonResponse({'status': 'error', 'message': 'One or more tags not found'}, status=404)
        
        removed_tags = []
        for tag in tags:
            grouptag = Grouptag.objects.get(groupid=group, tagid=tag)
            grouptag.delete()
            removed_tags.append(tag.id)
        return JsonResponse({'status': 'success', 'message': f'Tags {removed_tags} removed from group {group_id}'})
    
    except Group.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Group {group_id} not found'}, status=404)
    except Tag.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Tag not found'}, status=404)
    except Grouptag.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'GroupTag not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)

@require_POST
def addPlayerPreference(request):
    try:
        json_data = json.loads(request.body)
        user_id = json_data.get('user_id')
        tag_id = json_data.get('tag_id')
        islooking = json_data.get('islooking')
        
        user = User.objects.get(id=user_id)
        tag = Tag.objects.get(id=tag_id)
        
        # Only add the tag if it doesn't already exist
        if not Usertag.objects.filter(userid=user, tagid=tag).exists():
            Usertag.objects.create(userid=user, tagid=tag, islooking=islooking)
            return JsonResponse({'status': 'success', 'message': f'Tag {tag_id} added to user {user_id} preferences'})
        else:
            return JsonResponse({'status': 'info', 'message': f'Tag {tag_id} already exists for user {user_id}'})
        
    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'User {user_id} not found'}, status=404)
    except Tag.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Tag {tag_id} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)

@require_POST
def removePlayerPreference(request):
    try:
        json_data = json.loads(request.body)
        user_id = json_data.get('user_id')
        tag_id = json_data.get('tag_id')
        
        user = User.objects.get(id=user_id)
        tag = Tag.objects.get(id=tag_id)
        usertag = Usertag.objects.get(userid=user, tagid=tag)

        usertag.delete()
        return JsonResponse({'status': 'success', 'message': f'Tag {tag_id} removed from user {user_id} preferences'})
    
    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'User {user_id} not found'}, status=404)
    except Tag.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Tag {tag_id} not found'}, status=404)
    except Usertag.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'UserTag {tag_id} for user {user_id} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
############## End of Petr Plíhal work ##############################

##########################
# Autor: Marek Kozumplik
#
##########################

@require_GET
def getAllUsers(request):
    try:
        users = User.objects.all()
        users_json = modelAsJson(users)
        response = {'status': 'success', 'data': users_json}
        return JsonResponse(response)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)


@require_GET
def getAllGroups(request):
    try:
        groups = Group.objects.all()
        groups_json = modelAsJson(groups)
        response = {'status': 'success', 'data': groups_json}
        return JsonResponse(response)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400) 


@require_GET
def getOpenGroups(request):
    try:
        groups = Group.objects.filter(isopen=True)
        groups_json = modelAsJson(groups)
        response = {'status': 'success', 'data': groups_json}
        return JsonResponse(response)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)

# request with /groups/filter_tag/?tags=tag1&tags=tag2&tags=tag3
@require_GET
def getGroupsWithTags(request):
    try:
        tags = request.GET.getlist('tags')
        groups = Group.objects.filter(grouptag__tagid__name__in=tags).distinct()
        groups_json = modelAsJson(groups)
        response = {'status': 'success', 'data': groups_json}
        return JsonResponse(response)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)


# request with /groups/exclude_tag/?tags=tag1&tags=tag2&tags=tag3
@require_GET
def getGroupsWithoutTags(request):
    try:
        tags = request.GET.getlist('tags')
        groups = Group.objects.exclude(grouptag__tagid__name__in=tags).distinct()
        groups_json = modelAsJson(groups)
        response = {'status': 'success', 'data': groups_json}
        return JsonResponse(response)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)


@require_GET
def getUserSchedule(request, user_id):
    try:
        schedules = Schedule.objects.filter(userid=user_id)
        schedule_json = modelAsJson(schedules)
        response = {'status': 'success', 'data': schedule_json}
        return JsonResponse(response)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)


#@require_GET
#def getAppChat(request, app_id):
 #   app = Application.objects.get(id=app_id)
 #   return JsonResponse(app.appchatcontent, safe=False)

@require_GET
def getUserByID(request, user_id: int):
    try:
        user = User.objects.filter(id = user_id)
        user_data = modelAsJson(user)
        return JsonResponse({'status': 'success', 'data': user_data})
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)


@require_http_methods(["PUT"])
def updateUser(request, user_id: int):
    try:
        user = User.objects.get(id=user_id)
        json_data = json.loads(request.body)
        column_names = [field.name for field in User._meta.fields]
        for key in json_data:
            if key not in column_names:
                return JsonResponse({'status': 'error', 'message': f'Field {key} not found in User model'}, status=400)
            if key == 'id':
                return JsonResponse({'status': 'error', 'message': 'Cannot update id'}, status=400)
            setattr(user, key, json_data[key])
        user.save()
        return JsonResponse({'status': 'success', 'message': f'User {user_id} updated'})
    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'User {user_id} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
    

@require_http_methods(["PUT"])
def updateGroup(request, group_id: int):
    try:
        group = Group.objects.get(id = group_id)
        json_data = json.loads(request.body)
        column_names = [field.name for field in Group._meta.fields]
        for key in json_data:
            if key not in column_names:
                return JsonResponse({'status': 'error', 'message': f'Field {key} not found in User model'}, status=400)
            if key == 'id':
                return JsonResponse({'status': 'error', 'message': 'Cannot update id'}, status=400)
            setattr(group, key, json_data[key])
        group.save()
        return JsonResponse({'status': 'success', 'message': f'Group {group_id} updated'})
    except Group.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Group {group_id} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)


@require_GET
def getUserGroups(request, user_id: int):
    try:
        user = User.objects.get(id=user_id)
        belongsto_entries = Belongsto.objects.filter(userid=user)
        group_ids = [entry.groupid.id for entry in belongsto_entries]
        groups = Group.objects.filter(id__in=group_ids)
        groups_data = modelAsJson(groups)
        return JsonResponse({'status': 'success', 'data': groups_data})
    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'User {user_id} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)


# curl -X GET http://localhost:8000/group/1/owner/
@require_GET
def getGroupOwner(request, group_id: int):
    try:
        group = Group.objects.get(id=group_id)
        owner = Belongsto.objects.get(groupid=group, isowner=True)
        ownerData = modelAsJson([owner])

        return JsonResponse({'status': 'success', 'data': ownerData})

    except Group.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Group {group_id} not found'}, status=404)
    except Belongsto.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Owner of group {group_id} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
    
# curl -X GET http://localhost:8000/user/1/preferences/
@require_GET
def getPlayerPreferences(request, user_id: int):
    try:
        user = User.objects.get(id=user_id)
        userTags = Usertag.objects.filter(userid=user).values_list('tagid', flat=True)
        tags = Tag.objects.filter(id__in=userTags)
        tagsData = modelAsJson(tags)
        return JsonResponse({'status': 'success', 'data': tagsData})

    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'User {user_id} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
    
# curl -X GET http://localhost:8000/group/1/tags/
@require_GET
def getGroupTags(request, group_id: int):
    try:
        group = Group.objects.get(id=group_id)
        groupTags = Grouptag.objects.filter(groupid=group).values_list('tagid', flat=True)
        tags = Tag.objects.filter(id__in=groupTags)
        tagsData = modelAsJson(tags)
        return JsonResponse({'status': 'success', 'data': tagsData})

    except Group.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Group {group_id} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
    
# curl -X GET http://localhost:8000/user/3/sessions/
@require_GET
def getUserSessions(request, user_id: int):
    try:
        user = User.objects.get(id=user_id)
        belongsto = Belongsto.objects.filter(userid=user)
        groupIds = [entry.groupid.id for entry in belongsto]
        sessions = Session.objects.filter(groupid__in=groupIds)
        sessionsData = modelAsJson(sessions)
        return JsonResponse({'status': 'success', 'data': sessionsData})

    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'User {user_id} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
    
# curl -X GET http://localhost:8000/user/1/ownedGroups/
@require_GET
def getOwnedGroups(request, user_id: int):
    try:
        user = User.objects.get(id=user_id)
        belongsto = Belongsto.objects.filter(userid=user, isowner=True)
        groupIds = [entry.groupid.id for entry in belongsto]
        groups = Group.objects.filter(id__in=groupIds)
        groupsData = modelAsJson(groups)
        return JsonResponse({'status': 'success', 'data': groupsData})

    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'User {user_id} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
    
# curl -X DELETE http://localhost:8000/group/5/delete -H "Content-Type: application/json"
@require_http_methods(["DELETE"])
def deleteGroup(request, group_id: int):
    try:
        group = Group.objects.get(id=group_id)
        group.delete()
        return JsonResponse({'status': 'success', 'message': f'Group {group_id} deleted'})
    except Group.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Group {group_id} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)


# curl -X POST http://localhost:8000/group/1/setOwner/      -H "Content-Type: application/json"      -d '{"user_id": 2}'
@require_POST
def setGroupOwner(request, group_id: int):
    try:
        json_data = json.loads(request.body)
        user_id = json_data.get('user_id')
        group = Group.objects.get(id=group_id)
        user = User.objects.get(id=user_id)

        membership = Belongsto.objects.get(groupid=group, userid=user)
        membership.isowner = True
        membership.save()

        owners = Belongsto.objects.filter(groupid=group, isowner=True)
        for owner in owners:
            if owner.userid != user:
                owner.isowner = False
                owner.save()
                break

        return JsonResponse({'status': 'success', 'message': f'User {user_id} set as owner of group {group_id}'})
    except Group.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Group {group_id} not found'}, status=404)
    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'User {user_id} not found'}, status=404)
    except Belongsto.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Membership of user {user_id} and group {group_id} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)


# curl -X PUT http://localhost:8000/group/1/setNickname/      -H "Content-Type: application/json"      -d '{"user_id": 1, "nickname": "new_nickname"}'
@require_http_methods(["PUT"])
def setGroupUserNickname(request, group_id: int):
    try:
        json_data = json.loads(request.body)
        user_id = json_data.get('user_id')
        nickname = json_data.get('nickname')
        
        group = Group.objects.get(id=group_id)
        user = User.objects.get(id=user_id)
        membership = Belongsto.objects.get(groupid=group, userid=user)
        membership.nickname = nickname
        membership.save()
        return JsonResponse({'status': 'success', 'message': f'User {user_id} nickname set to {nickname} in group {group_id}'})
    except Group.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Group {group_id} not found'}, status=404)
    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'User {user_id} not found'}, status=404)
        
    
# curl -X GET http://localhost:8000/group/1/applications/
@require_GET
def getGroupApplications(request, group_id: int):
    try:
        group = Group.objects.get(id=group_id)
        applications = Application.objects.filter(groupid=group)

        applicationsData = modelAsJson(applications)

        for application in applicationsData:
            applicant_id = application['fields']['applicantid']
            applicant = User.objects.get(id=applicant_id)
            application['fields']['applicant_name'] = applicant.username
            
        return JsonResponse({'status': 'success', 'data': applicationsData})

    except Group.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Group {group_id} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)


# curl -X GET http://localhost:8000/user/1/applications/
@require_GET
def getUserApplications(request, user_id: int):
    try:
        user = User.objects.get(id=user_id)
        applications = Application.objects.filter(applicantid=user)
        applicationsData = modelAsJson(applications)
        
        # Add group names to the applications data
        for application in applicationsData:
            group_id = application['fields']['groupid']
            group = Group.objects.get(id=group_id)
            application['fields']['group_name'] = group.name
        
        return JsonResponse({'status': 'success', 'data': applicationsData})

    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'User {user_id} not found'}, status=404)
    except Group.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Group not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
    
# curl GET http://localhost:8000/tags/
@require_GET
def getAllTags(request):
    try:
        tags = Tag.objects.all()
        tagsData = modelAsJson(tags)
        return JsonResponse({'status': 'success', 'data': tagsData})
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)



# curl -X POST http://localhost:8000/tag/create/      -H "Content-Type: application/json"      -d '{"name": "new_tag_name"}'
@require_POST
def createTag(request):
    try:
        json_data = json.loads(request.body)
        if not 'name' in json_data:
            return JsonResponse({'status': 'error', 'message': 'Missing name field'}, status=400)
        if Tag.objects.filter(name=json_data['name']).exists():
            return JsonResponse({'status': 'error', 'message': 'Tag already exists'}, status=409)
            
        tag = Tag(name=json_data['name'])
        tag.save()
        return JsonResponse({'status': 'success', 'message': f'Tag {tag.name} created'})
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


############## End of Marek Kozumplik work ##############################


##########################
# Autor: Marek Pechan
#
##########################
@require_GET
def getGroupApps(request, group_id: int):
    try:
        group = Group.objects.get(id = group_id)
        groupApps = Application.objects.filter(groupid = group)
        groupAppsData = modelAsJson(groupApps)

        return JsonResponse({'status': 'success', 'data': groupAppsData})

    except Group.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Group {group_id} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)

#returns the belongsto rows, to get users another endpoint needs to be called
@require_GET
def getGroupPlayers(request, group_id: int):
    try:
        group = Group.objects.get(id = group_id)
        groupPlayers = Belongsto.objects.filter(groupid = group)
        groupPlayerData = modelAsJson(groupPlayers)

        return JsonResponse({'status': 'success', 'data': groupPlayerData})

    except Group.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Group {group_id} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)

@require_GET
def getGroupByID(request, group_id: int):
    
    try:
        group = Group.objects.filter(id = group_id)
        groupData = modelAsJson(group)

        return JsonResponse({'status': 'success', 'data': groupData})

    except Group.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Group {group_id} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)

@require_GET
def getGroupByName(request, group_name: str):
    try:
        group = Group.objects.filter(name = group_name)
        groupData = modelAsJson(group)

        return JsonResponse({'status': 'success', 'data': groupData})

    except Group.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Group {group_name} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)

#this endpoint expects the description to be sent in plaintext as the body of the request
@require_GET
def getGroupByDescription(request):
    if not request.body:
        return JsonResponse({'status': 'error', 'message': 'No data provided'}, status=400)
    
    try:
        body_decode = request.body.decode('utf-8')
        group = Group.objects.filter(description = body_decode)
        groupData = modelAsJson(group)

        return JsonResponse({'status': 'success', 'data': groupData})

    except Group.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Group with the requested description not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)

@require_GET
def getUsersByPreference(request, tag_id: int):
    try:
        tag = Tag.objects.get(id = tag_id)
        tagUsers = Usertag.objects.filter(tagid = tag, islooking = True)
        tagUsersData = modelAsJson(tagUsers)

        return JsonResponse({'status': 'success', 'data': tagUsersData})

    except Tag.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Group {tag_id} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)

@require_GET
def getUsersByAvoidance(request, tag_id: int):
    try:
        tag = Tag.objects.get(id = tag_id)
        tagUsers = Usertag.objects.filter(tagid = tag, islooking = False)
        tagUsersData = modelAsJson(tagUsers)

        return JsonResponse({'status': 'success', 'data': tagUsersData})

    except Tag.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Group {tag_id} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)

@require_GET   
def getGroupChat(request, group_id: int):
    try:
        fetchedChat = Chat.objects.get(groupid=group_id)

        return JsonResponse({'status': 'success', 'data': modelAsJson([fetchedChat, ])})
    except Chat.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Chat of group {group_id} not found'}, status=404)
    
@require_GET   
def getAppChat(request, app_id: int):
    try:
        fetchedChat = Chat.objects.get(applicationid=app_id)

        return JsonResponse({'status': 'success', 'data': modelAsJson([fetchedChat, ])})
    except Chat.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Chat of application{app_id} not found'}, status=404)
    
@require_POST
def createChatMessage(request):
    try:
        print(request.body)
        jsonData = json.loads(request.body)
        chatId = jsonData.get('chatid')
        userId = jsonData.get('userid')

        newChatMessage = Chatmessage()
        for key in jsonData:
            if (key == 'chatid'):
                setattr(newChatMessage, key, Chat.objects.get(id=jsonData[key]))
                continue
            if (key == 'userid'):
                setattr(newChatMessage, key, User.objects.get(id=jsonData[key]))
                continue  
            setattr(newChatMessage, key, jsonData[key])
        setattr(newChatMessage, 'timestamp', datetime.now())
        newChatMessage.save()

        return JsonResponse({'status': 'success', 'data': modelAsJson([newChatMessage, ])})

    except Chat.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Chat {chatId} not found'}, status=404)
    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'User {userId} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
    
@require_POST
def editChatMessage(request, chatmessage_id: int):
    try:
        jsonData = json.loads(request.body)
        editedChatMessage = Chatmessage.objects.get(id=chatmessage_id)
        if editedChatMessage.chatmessagetype == 'PRF' or editedChatMessage.chatmessagetype == 'SCD':
            return JsonResponse({'status': 'error', 'message': 'Cannot edit messages of types: preferences, schedule'}, status=400)
        setattr(editedChatMessage, 'content', jsonData['content'])
        editedChatMessage.save()

        return JsonResponse({'status': 'success', 'data': modelAsJson([editedChatMessage, ])})

    except Chatmessage.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Chat message {chatmessage_id} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
    
@require_GET
def deleteChatMessage(request, chatmessage_id: int):
    try:
        Chatmessage.objects.get(id=chatmessage_id).delete()
        return JsonResponse({'status': 'success', 'message': f'Chat message {chatmessage_id} has been deleted'})

    except Chatmessage.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Chat message {chatmessage_id} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
    
@require_GET
def getChatMessages(request, chat_id: int):
    try:
        chats = Chatmessage.objects.filter(chatid=chat_id)
        return JsonResponse({'status': 'success', 'data': modelAsJson(chats)})

    except Chatmessage.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Chat message {chat_id} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)

@require_GET   
def getGroupChat(request, group_id: int):
    try:
        fetchedChat = Chat.objects.get(groupid=group_id)

        return JsonResponse({'status': 'success', 'data': modelAsJson([fetchedChat, ])})
    except Chat.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Chat of group {group_id} not found'}, status=404)
    
@require_GET   
def getAppChat(request, app_id: int):
    try:
        fetchedChat = Chat.objects.get(applicationid=app_id)

        return JsonResponse({'status': 'success', 'data': modelAsJson([fetchedChat, ])})
    except Chat.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Chat of application{app_id} not found'}, status=404)
    
@require_POST
def createChatMessage(request):
    try:
        print(request.body)
        jsonData = json.loads(request.body)
        chatId = jsonData.get('chatid')
        userId = jsonData.get('userid')

        newChatMessage = Chatmessage()
        for key in jsonData:
            if (key == 'chatid'):
                setattr(newChatMessage, key, Chat.objects.get(id=jsonData[key]))
                continue
            if (key == 'userid'):
                setattr(newChatMessage, key, User.objects.get(id=jsonData[key]))
                continue  
            setattr(newChatMessage, key, jsonData[key])
        setattr(newChatMessage, 'timestamp', datetime.now())
        newChatMessage.save()

        return JsonResponse({'status': 'success', 'data': modelAsJson([newChatMessage, ])})

    except Chat.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Chat {chatId} not found'}, status=404)
    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'User {userId} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)


# This endpoint only changes the content of the chat message, nothing else
@require_POST
def editChatMessage(request, chatmessage_id: int):
    try:
        jsonData = json.loads(request.body)
        editedChatMessage = Chatmessage.objects.get(id=chatmessage_id)
        if editedChatMessage.chatmessagetype == 'PRF' or editedChatMessage.chatmessagetype == 'SCD':
            return JsonResponse({'status': 'error', 'message': 'Cannot edit messages of types: preferences, schedule'}, status=400)
        setattr(editedChatMessage, 'content', jsonData['content'])
        editedChatMessage.save()

        return JsonResponse({'status': 'success', 'data': modelAsJson([editedChatMessage, ])})

    except Chatmessage.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Chat message {chatmessage_id} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
    
@require_GET
def deleteChatMessage(request, chatmessage_id: int):
    try:
        Chatmessage.objects.get(id=chatmessage_id).delete()
        return JsonResponse({'status': 'success', 'message': f'Chat message {chatmessage_id} has been deleted'})

    except Chatmessage.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Chat message {chatmessage_id} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
    
@require_GET
def getChatMessages(request, chat_id: int):
    try:
        chats = Chatmessage.objects.filter(chatid=chat_id)
        return JsonResponse({'status': 'success', 'data': modelAsJson(chats)})

    except Chatmessage.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'Chat message {chat_id} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)

#curl -X POST "http://127.0.0.1:8000/schedule/create/" -H "Content-Type: application/json" -d "{\"userid\": 1, \"day\": \"Mo\", \"starttime\": \"12:25:43.511\", \"endtime\": \"18:25:43.511\"}" 
@require_POST
def createSchedule(request):
    try:
        jsonData = json.loads(request.body)
        userid = jsonData['userid']
        user = User.objects.get(id=jsonData['userid'])
        newSchedule = Schedule()
        for key in jsonData:
            if key == 'userid':
                setattr(newSchedule, key, user)
            setattr(newSchedule, key, jsonData[key])
        newSchedule.save()

        return JsonResponse({'status': 'success', 'data': modelAsJson([newSchedule, ])})

    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f'User {userid} not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)

#this endpoint changes the start time and end time, nothing else
@require_POST
def editSchedule(request, sched_id: int):
    try:
        jsonData = json.loads(request.body)
        editedSched = Schedule.objects.get(id=sched_id)
        setattr(editedSched, 'starttime', jsonData['starttime'])
        setattr(editedSched, 'endtime', jsonData['endtime'])
        editedSched.save()
        return JsonResponse({'status': 'success', 'data': modelAsJson([editedSched, ])})

    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
    
@require_GET
def deleteSchedule(request, sched_id: int):
    try:
        Schedule.objects.get(id=sched_id).delete()
        return JsonResponse({'status': 'success', 'data': f'Schedule {sched_id} has been deleted'})

    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)

############## End of Marek Pechan work ##############################
