import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:intl/intl.dart';  // Import gói intl

import '../../model/user.dart';
import '../../firebase/Group.dart';

class ChatScreen extends StatefulWidget {
  final Group group;
  final User currentUser;

  const ChatScreen({
    Key? key,
    required this.group,
    required this.currentUser,
  }) : super(key: key);

  @override
  _ChatScreenState createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _messageController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.group.name),
        backgroundColor: Colors.teal,
      ),
      body: Column(
        children: [
          Expanded(
            child: StreamBuilder<QuerySnapshot>(
              stream: FirebaseFirestore.instance
                  .collection('groups')
                  .doc(widget.group.id)
                  .collection('messages')
                  .orderBy('createdAt', descending: true)
                  .snapshots(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Center(child: Text('Error: ${snapshot.error}'));
                } else if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
                  return Center(child: Text('Chưa có tin nhắn.'));
                }

                final messages = snapshot.data!.docs;

                return ListView.builder(
                  reverse: true,
                  itemCount: messages.length,
                  itemBuilder: (context, index) {
                    final message = messages[index];
                    final sender = message['sender'] as Map<String, dynamic>;
                    final isCurrentUser = sender['id'] == widget.currentUser.id;

                    // Định dạng thời gian
                    final messageTime = (message['createdAt'] as Timestamp).toDate();
                    final formattedTime = DateFormat('h:mm a, dd MMM yyyy').format(messageTime);

                    return GestureDetector(
                      onLongPress: () => _showMemberInfoDialog(sender),  // Show member info on long press
                      child: Align(
                        alignment:
                        isCurrentUser ? Alignment.centerRight : Alignment.centerLeft,
                        child: Container(
                          padding: EdgeInsets.all(10.0),
                          margin: EdgeInsets.symmetric(vertical: 4.0, horizontal: 8.0),
                          decoration: BoxDecoration(
                            color: isCurrentUser ? Colors.teal[200] : Colors.grey[300],
                            borderRadius: BorderRadius.circular(12.0),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              if (!isCurrentUser)
                                Text(
                                  sender['username'] ?? 'Unknown',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: Colors.teal[800],
                                  ),
                                ),
                              Text(
                                message['text'],
                                style: TextStyle(
                                  fontSize: 16.0,
                                  color: Colors.black87,
                                ),
                              ),
                              SizedBox(height: 5.0),
                              Text(
                                formattedTime,  // Sử dụng thời gian đã định dạng
                                style: TextStyle(
                                  fontSize: 12.0,
                                  color: Colors.grey[600],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _messageController,
                    decoration: InputDecoration(
                      hintText: 'Nhập tin nhắn...',
                      border: OutlineInputBorder(),
                      contentPadding: EdgeInsets.symmetric(horizontal: 16.0),
                    ),
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.send, color: Colors.teal),
                  onPressed: _sendMessage,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _sendMessage() async {
    final messageText = _messageController.text.trim();
    if (messageText.isNotEmpty) {
      await FirebaseFirestore.instance
          .collection('groups')
          .doc(widget.group.id)
          .collection('messages')
          .add({
        'text': messageText,
        'createdAt': Timestamp.now(),
        'sender': {
          'id': widget.currentUser.id,
          'username': widget.currentUser.username,
          'email': widget.currentUser.email,
        },
        'files': [],
      });

      _messageController.clear();
    }
  }

  void _showMemberInfoDialog(Map<String, dynamic> sender) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text('Thông tin thành viên'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Tên: ${sender['username'] ?? 'Không rõ'}'),
              Text('Email: ${sender['email'] ?? 'Không rõ'}'),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('Đóng'),
            ),
          ],
        );
      },
    );
  }
}
