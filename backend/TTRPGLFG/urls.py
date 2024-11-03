from django.urls import re_path

from . import views

urlpatterns = [
    re_path("^users/?$", views.get_all_users, name="get_all_users"),
    re_path("^groups/?$", views.get_all_groups, name="get_all_groups"),
    re_path("^groups/filter_open/?$", views.get_open_groups, name="get_open_groups"),
    re_path("^groups/filter_tags/?$", views.get_groups_with_tags, name="get_groups_with_tag"),
    re_path("^groups/exclude_tags/?$", views.get_groups_with_tags, name="get_groups_with_tag"),
    re_path("^users/user/(?<user_id>\\d+)/schedule/?$", views.get_user_schedule, name="get_user_schedule"),
    re_path("^applications/application/(?<app_id>\\d+)/chat/?$", views.get_app_chat, name="get_app_chat"),
]
