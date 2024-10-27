from django.shortcuts import render
from django.http import HttpResponse
from TTRPGLFG.models import User, Group, Belongsto, Session


def index(request):
    response = b'''\
This is the <a href="http://127.0.0.1:8000/">home page</a> (<a href="http://127.0.0.1:8000/ttrpglfg/">alternative link</a>)<br>
available endpoints are<br>
- <a href="http://127.0.0.1:8000/admin/">admin page</a><br>
(The following URLs have a number in the adress bar which you can change to look at a different row of the table)<br>
- <a href="http://127.0.0.1:8000/ttrpglfg/user/1">single user view</a><br>
- <a href="http://127.0.0.1:8000/ttrpglfg/group/1">single group view</a><br>
- <a href="http://127.0.0.1:8000/ttrpglfg/user/1/groups">user\'s groups view</a><br>
- <a href="http://127.0.0.1:8000/ttrpglfg/group/1/sessions">group\'s sessions view</a><br>
'''
    return HttpResponse(response)


def user_detail(request, user_id):
    if user_id >= User.objects.count() or user_id < 1:
        return HttpResponse(b'User ID out of range')

    user = User.objects.get(id=user_id)

    response = f'''\
User {user_id}:<br>
- username: {user.username}<br>
- profilepicture: {user.profilepicture}<br>
- description: {user.description}<br>
- candm: {user.candm}
'''
    prev = f'<br><br><a href="http://127.0.0.1:8000/ttrpglfg/user/{user_id - 1}">Previous user</a>'
    mid = ''
    next = f'<a href="http://127.0.0.1:8000/ttrpglfg/user/{user_id + 1}">Next user</a>'
    if user_id != 1:
        response += prev
        mid = ' | '
    else:
        mid = '<br><br>'
    if user_id != User.objects.count() - 1:
        response += mid + next

    response += '<br><br><a href="http://127.0.0.1:8000/">Back to home</a>'

    return HttpResponse(bytes(response, 'utf-8'))


def group_detail(request, group_id):
    if group_id >= Group.objects.count() or group_id < 1:
        return HttpResponse(b'Group ID out of range')

    group = Group.objects.get(id=group_id)

    response = f'''\
Group {group_id}:<br>
- name: {group.name}<br>
- description: {group.description}<br>
- location: {group.location}<br>
- isopen: {group.isopen}<br>
- languages: {group.languages}<br>
- maxsize: {group.maxsize}<br>
- dmneeded: {group.dmneeded}<br>
- gameid: {group.gameid.name}<br>
- groupchatcontent: {group.groupchatcontent}<br>
'''
    prev = f'<br><br><a href="http://127.0.0.1:8000/ttrpglfg/group/{group_id - 1}">Previous group</a>'
    mid = ''
    next = f'<a href="http://127.0.0.1:8000/ttrpglfg/group/{group_id + 1}">Next group</a>'
    if group_id != 1:
        response += prev
        mid = ' | '
    else:
        mid = '<br><br>'
    if group_id != Group.objects.count() - 1:
        response += mid + next

    response += '<br><br><a href="http://127.0.0.1:8000/">Back to home</a>'

    return HttpResponse(bytes(response, 'utf-8'))


def user_groups(request, user_id):
    if user_id >= User.objects.count() or user_id < 1:
        return HttpResponse(b'User ID out of range')

    user_groups = Belongsto.objects.filter(userid=user_id).select_related('groupid')
    groups = [entry.groupid for entry in user_groups]

    response = f'Groups of user {user_id}:<br>' + '<br>'.join([f'{group.id}: {group.name}' for group in groups])

    prev = f'<br><br><a href="http://127.0.0.1:8000/ttrpglfg/user/{user_id - 1}/groups">Previous user</a>'
    mid = ''
    next = f'<a href="http://127.0.0.1:8000/ttrpglfg/user/{user_id + 1}/groups">Next user</a>'
    if user_id != 1:
        response += prev
        mid = ' | '
    else:
        mid = '<br><br>'
    if user_id != User.objects.count() - 1:
        response += mid + next

    response += '<br><br><a href="http://127.0.0.1:8000/">Back to home</a>'

    return HttpResponse(bytes(response, 'utf-8'))


def group_sessions(request, group_id):
    if group_id >= Group.objects.count() or group_id < 1:
        return HttpResponse(b'Group ID out of range')

    sessions = Session.objects.filter(groupid=group_id)

    response = f'Sessions of group {group_id}:<br>' + '<br>'.join([f'{session.num}: {session.starttime}, {session.description}' for session in sessions])

    prev = f'<br><br><a href="http://127.0.0.1:8000/ttrpglfg/group/{group_id - 1}/sessions">Previous group</a>'
    mid = ''
    next = f'<a href="http://127.0.0.1:8000/ttrpglfg/group/{group_id + 1}/sessions">Next group</a>'
    if group_id != 1:
        response += prev
        mid = ' | '
    else:
        mid = '<br><br>'
    if group_id != Group.objects.count() - 1:
        response += mid + next

    response += '<br><br><a href="http://127.0.0.1:8000/">Back to home</a>'

    return HttpResponse(bytes(response, 'utf-8'))
