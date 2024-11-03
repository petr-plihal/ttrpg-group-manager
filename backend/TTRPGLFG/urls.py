from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("user/<int:user_id>/", views.user_detail, name="user_detail"),
    path("group/<int:group_id>/", views.group_detail, name="group_detail"),
    path("user/<int:user_id>/groups/", views.user_groups, name="user_groups"),
    path("group/<int:group_id>/sessions/", views.group_sessions, name="group_sessions"),
    path("users/", views.get_all_users, name="get_all_users"),
    path("groups/", views.get_all_groups, name="get_all_groups"),
    path("groups/filter_open/", views.get_open_groups, name="get_open_groups"),
    path("groups/filter_tags/", views.get_groups_with_tags, name="get_groups_with_tag"),
    path("groups/exclude_tags/", views.get_groups_with_tags, name="get_groups_with_tag"),
    path("users/user/<int:user_id>/schedule/", views.get_user_schedule, name="get_user_schedule"),
    path("applications/application/<int:app_id>/chat/", views.get_app_chat, name="get_app_chat"),
]
