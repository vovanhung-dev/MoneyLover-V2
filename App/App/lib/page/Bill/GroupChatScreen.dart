import 'package:flutter/material.dart';
import 'package:shoehubapp/data/api.dart';
import 'package:shoehubapp/data/sharepre.dart';

import '../../firebase/Group.dart';
import '../../firebase/group_chat_service.dart';
import '../../model/user.dart';
import 'ChatScreen.dart';

class GroupChatScreen extends StatefulWidget {
  @override
  _GroupChatScreenState createState() => _GroupChatScreenState();
}

class _GroupChatScreenState extends State<GroupChatScreen> {
  late Future<List<Group>> _userGroups;
  late Future<User> _userFuture;

  @override
  void initState() {
    super.initState();
    _userFuture = getUser(); // Fetch user info
    _userGroups = _userFuture.then((user) => getUserGroups(user.id as String)); // Fetch groups using user ID
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Group Chat', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.teal,
        elevation: 4.0,
      ),
      body: FutureBuilder<User>(
        future: _userFuture,
        builder: (context, userSnapshot) {
          if (userSnapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (userSnapshot.hasError) {
            return Center(child: Text('Error: ${userSnapshot.error}'));
          } else if (!userSnapshot.hasData) {
            return Center(child: Text('User not found.'));
          }

          final user = userSnapshot.data!;

          return FutureBuilder<List<Group>>(
            future: getUserGroups(user.id as String),
            builder: (context, groupsSnapshot) {
              if (groupsSnapshot.connectionState == ConnectionState.waiting) {
                return Center(child: CircularProgressIndicator());
              } else if (groupsSnapshot.hasError) {
                return Center(child: Text('Error: ${groupsSnapshot.error}'));
              } else if (!groupsSnapshot.hasData || groupsSnapshot.data!.isEmpty) {
                return Center(child: Text('No groups found.'));
              }

              final groups = groupsSnapshot.data!;

              return ListView.separated(
                padding: EdgeInsets.all(12.0),
                separatorBuilder: (context, index) => Divider(height: 1, color: Colors.grey[300]),
                itemCount: groups.length,
                itemBuilder: (context, index) {
                  final group = groups[index];
                  return ListTile(
                    contentPadding: EdgeInsets.symmetric(vertical: 8.0),
                    leading: CircleAvatar(
                      backgroundColor: Colors.teal,
                      child: Text(
                        group.name[0].toUpperCase(),
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                      ),
                    ),
                    title: Text(
                      group.name,
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                    ),
                    subtitle: Text(
                      'Members: ${group.membersId.length}',
                      style: TextStyle(color: Colors.grey[600]),
                    ),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => ChatScreen(group: group, currentUser: user),
                        ),
                      );
                    },
                    trailing: Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey[600]),
                  );
                },
              );
            },
          );
        },
      ),
    );
  }
}
