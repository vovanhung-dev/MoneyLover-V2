// group.dart
import 'package:cloud_firestore/cloud_firestore.dart';

class Group {
  final String id;
  final String name;
  final List<String> membersId;

  Group({
    required this.id,
    required this.name,
    required this.membersId,
  });

  factory Group.fromDocument(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return Group(
      id: doc.id,
      name: data['name'] ?? '',
      membersId: List<String>.from(data['membersId'] ?? []),
    );
  }
}
