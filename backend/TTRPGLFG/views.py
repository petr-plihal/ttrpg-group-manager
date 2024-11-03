from django.contrib.admin.options import json
from django.http import JsonResponse
from django.core.serializers import serialize
from django.views.decorators.http import require_GET, require_POST
from TTRPGLFG.models import User, Group, Game, Application, Belongsto

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

    if not json_data or not hasattr(json_data, 'username') or not json_data['username']:
        return JsonResponse({'status': 'error', 'message': 'Wrong JSON format'}, status=400)

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

    return JsonResponse({'status': 'success'})


@reuqire_GET
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


@reuqire_POST
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
