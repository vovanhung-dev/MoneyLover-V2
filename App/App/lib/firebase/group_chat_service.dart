// group_chat_service.dart
import 'package:cloud_firestore/cloud_firestore.dart';

import '../data/sharepre.dart';
import '../model/user.dart';
import 'Group.dart';

Future<void> createGroupChat(String groupId, String groupName, List<User> users) async {
  try {
    final groupRef = FirebaseFirestore.instance.collection('groups').doc(groupId);
    final groupSnapshot = await groupRef.get();

    // Tạo danh sách các thành viên với kiểu Map<String, dynamic>
    final userAndTime = users.map((user) {
      return {
        'user': user.toJson(),
        'createdAd': Timestamp.now(),
      };
    }).toList();

    final creator = await getUser();
    final creatorId = creator.id;

    if (groupSnapshot.exists) {
      print('Group chat already exists with ID: $groupId');

      final existingGroup = groupSnapshot.data()!;

      // Lấy danh sách `membersId` hiện tại
      final existingMemberIds = List<String>.from(existingGroup['membersId'] ?? []);

      // Lọc ra các thành viên mới chưa có trong nhóm
      final newMembers = users.where((user) => !existingMemberIds.contains(user.id)).toList();

      if (newMembers.isNotEmpty) {
        // Cập nhật `membersId` với các ID mới
        final newMemberIds = newMembers.map((user) => user.id).toList();
        await groupRef.update({
          'membersId': FieldValue.arrayUnion(newMemberIds),
        });

        // Cập nhật `unreadCount` với các thành viên mới
        final Map<String, dynamic> existingUnreadCount = Map<String, dynamic>.from(existingGroup['unreadCount'] ?? {});
        newMembers.forEach((user) {
          existingUnreadCount[user.id as String] = 0;  // Thêm thành viên mới với số lượng tin nhắn chưa đọc là 0
        });
        await groupRef.update({
          'unreadCount': existingUnreadCount,
        });

        // Cập nhật `members` mảng với thông tin thành viên mới
        final newMembersMap = newMembers.map((user) {
          return {
            'user': user.toJson(),
            'createdAd': Timestamp.now(),
          };
        }).toList();
        await groupRef.update({
          'members': FieldValue.arrayUnion(newMembersMap),
        });

        print('Members added to group and existing fields updated');
      }

      return;
    }

    // Tạo nhóm chat mới nếu nhóm chưa tồn tại
    final membersId = users.map((user) => user.id).toList();
    final unreadCount = Map.fromEntries(
      users.map((user) => MapEntry(user.id, 0)),
    );

    final groupMess = {
      'name': groupName,
      'members': userAndTime,
      'changeName': false,
      'membersId': membersId,
      'creator': creatorId,
      'unreadCount': unreadCount,
      'createdAt': Timestamp.now(),
    };

    await groupRef.set(groupMess);
    print('Group chat created with ID: $groupId');
  } catch (error) {
    print('Error creating group chat: $error');
  }
}


Future<void> addMemberToGroup(String groupId, Map<String, dynamic> newMember) async {
  try {
    final groupRef = FirebaseFirestore.instance.collection('groups').doc(groupId);
    await groupRef.update({
      'members': FieldValue.arrayUnion([newMember]),
    });
    print('Member added to group');
  } catch (error) {
    print('Error adding member to group: $error');
  }
}

Future<List<Group>> getUserGroups(String userId) async {
  try {
    final groupsQuery = FirebaseFirestore.instance
        .collection('groups')
        .where('membersId', arrayContains: userId);
    final querySnapshot = await groupsQuery.get();
    return querySnapshot.docs.map((doc) => Group.fromDocument(doc)).toList();
  } catch (error) {
    print('Error fetching groups: $error');
    return [];
  }
}

Future<void> updateGroupName(String groupId, String newName) async {
  try {
    final groupRef = FirebaseFirestore.instance.collection('groups').doc(groupId);
    await groupRef.update({
      'name': newName,
    });
    print('Group name updated to: $newName');
  } catch (error) {
    print('Error updating group name: $error');
  }
}

