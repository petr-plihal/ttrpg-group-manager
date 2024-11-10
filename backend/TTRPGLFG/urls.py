from django.urls import re_path

from . import views

urlpatterns = [
    re_path("^user/?$", views.createUser, name="createUser"),
    re_path("^dmusers/?$", views.getDMUsers, name="getDMUsers"),
    re_path("^group/?$", views.createGroup, name="createGroup"),
    re_path("^group/(?P<game>\\d+)/?$", views.getGroupByGame, name="getGroupByGame"),
    re_path("^group/(?P<languages>\\w+)/?$", views.getGroupByLanguage, name="getGroupByLanguage"),
    re_path("^groupnodm/?$", views.getGroupWithoutDM, name="getGroupWithoutDM"),
    re_path("^game/?$", views.createGame, name="createGame"),
    re_path("^denyApplication/(?P<application_id>\\d+)/?$", views.denyApplication, name="denyApplication"),
    re_path("^acceptApplication/(?P<application_id>\\d+)/?$", views.acceptApplication, name="acceptApplication"),
    re_path("^kickPlayer/?$", views.kickPlayer, name="kickPlayer"),
    re_path("^invitePlayer/?$", views.invitePlayer, name="invitePlayer"),
    re_path("^applyToGroup/?$", views.applyToGroup, name="applyToGroup"),
    re_path("^cancelApplication/?$", views.cancelApplication, name="cancelApplication"),
    re_path("^getGroupSessions/(?P<group_id>\\d+)/?$", views.getGroupSessions, name="getGroupSessions"),
    re_path("^addGroupTags/?$", views.addGroupTags, name="addGroupTags"),
    re_path("^removeGroupTags/?$", views.removeGroupTags, name="removeGroupTags"),
    re_path("^addPlayerPreference/?$", views.addPlayerPreference, name="addPlayerPreference"),
    re_path("^removePlayerPreference/?$", views.removePlayerPreference, name="removePlayerPreference"),
    re_path("^users/?$", views.get_all_users, name="get_all_users"),
    re_path("^groups/?$", views.get_all_groups, name="get_all_groups"),
    re_path("^groups/filter_open/?$", views.get_open_groups, name="get_open_groups"),
    re_path("^groups/filter_tags/?$", views.get_groups_with_tags, name="get_groups_with_tag"),
    re_path("^groups/exclude_tags/?$", views.get_groups_with_tags, name="get_groups_with_tag"),
    re_path("^users/user/(?P<user_id>\\d+)/schedule/?$", views.get_user_schedule, name="get_user_schedule"),
    re_path("^applications/application/(?P<app_id>\\d+)/chat/?$", views.get_app_chat, name="get_app_chat"),
]
