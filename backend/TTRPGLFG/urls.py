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
]
