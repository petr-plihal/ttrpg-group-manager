from django.http import JsonResponse
from django.core.serializers import serialize
from django.views.decorators.http import require_GET
from TTRPGLFG.models import Application, Schedule, User, Group

def modelAsJson(model):
    return serialize('json', model)

@require_GET
def get_all_users(request):
    users = User.objects.all()
    users_json = modelAsJson(users)
    response = {'success': True, 'data': users_json}
    return JsonResponse(response)


@require_GET
def get_all_groups(request):
    groups = Group.objects.all()
    groups_json = modelAsJson(groups)
    response = {'success': True, 'data': groups_json}
    return JsonResponse(response)


@require_GET
def get_open_groups(request):
    groups = Group.objects.filter(isopen=True)
    groups_json = modelAsJson(groups)
    response = {'success': True, 'data': groups_json}
    return JsonResponse(response)


# call this with /groups/filter_tag/?tags=tag1&tags=tag2&tags=tag3
@require_GET
def get_groups_with_tags(request):
    tags = request.GET.getlist('tags')
    groups = Group.objects.filter(grouptag__tagid__name__in=tags).distinct()
    groups_json = modelAsJson(groups)
    response = {'success': True, 'data': groups_json}
    return JsonResponse(response)

# call this with /groups/exclude_tag/?tags=tag1&tags=tag2&tags=tag3
@require_GET
def get_groups_without_tags(request):
    tags = request.GET.getlist('tags')
    groups = Group.objects.exclude(grouptag__tagid__name__in=tags).distinct()
    groups_json = modelAsJson(groups)
    response = {'success': True, 'data': groups_json}
    return JsonResponse(response)


@require_GET
def get_user_schedule(request, user_id):
    schedules = Schedule.objects.filter(userid=user_id)
    schedule_json = modelAsJson(schedules)
    response = {'success': True, 'data': schedule_json}
    return JsonResponse(response)

@require_GET
def get_app_chat(request, app_id):
    app = Application.objects.get(id=app_id)
    return JsonResponse(app.appchatcontent, safe=False)
