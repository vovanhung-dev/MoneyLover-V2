import 'package:flutter/material.dart';
import '../data/api.dart';
import '../data/sharepre.dart';
import '../model/user.dart';
import 'WordManagement.dart';

class TopicManagement extends StatefulWidget {
  final String folderId;

  const TopicManagement({Key? key, required this.folderId}) : super(key: key);

  @override
  _TopicManagementState createState() => _TopicManagementState();
}

class _TopicManagementState extends State<TopicManagement> {
  late Future<List<dynamic>> _topicListFuture;
  final TextEditingController _topicNameController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _topicListFuture = _fetchTopicList();
  }

  Future<List<dynamic>> _fetchTopicList() async {
    String token = ''; // Lấy token từ Share Preference hoặc nơi lưu trữ khác
    User? user = await getUser();

    return APIRepository().getTopicsByUserId(user.id!, token);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Topic Management'),
      ),
      body: FutureBuilder<List<dynamic>>(
        future: _topicListFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          } else {
            List<dynamic> topicList = snapshot.data!;
            return ListView.builder(
              itemCount: topicList.length,
              itemBuilder: (context, index) {
                dynamic topic = topicList[index];
                return Card(
                  margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: ListTile(
                    title: Text("Name: "+ topic['name']),
                    subtitle: Text("Description: "+topic['description']),
                    onTap: () {
                      _navigateToWordManagement(topic['id'].toString()); // Chuyển sang WordManagement với topicId
                    },
                    onLongPress: () {
                      _showTopicOptions(context, topic);
                    },
                  ),
                );
              },
            );
          }
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          _showCreateTopicDialog(context);
        },
        child: Icon(Icons.add),
      ),
    );
  }


  void _navigateToWordManagement(String topicId) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => WordManagement(topicId: topicId), // Chuyển sang WordManagement với topicId
      ),
    );
  }

  void _showCreateTopicDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text("Create Topic"),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: _topicNameController,
                decoration: InputDecoration(labelText: "Topic Name"),
              ),
              TextField(
                controller: _descriptionController,
                decoration: InputDecoration(labelText: "Description"),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context); // Đóng dialog
              },
              child: Text("Cancel"),
            ),
            ElevatedButton(
              onPressed: () {
                _createTopic(context);
              },
              child: Text("Create"),
            ),
          ],
        );
      },
    );
  }

  void _createTopic(BuildContext context) async {
    String token = ''; // Lấy token từ Share Preference hoặc nơi lưu trữ khác
    String topicName = _topicNameController.text.trim();
    String description = _descriptionController.text.trim();

    if (topicName.isNotEmpty) {
      User? user = await getUser();

      await APIRepository().createTopic(user.id!, topicName, description, widget.folderId, token);
      setState(() {
        _topicListFuture = _fetchTopicList();
      });
      Navigator.pop(context); // Đóng dialog sau khi tạo chủ đề
    }
  }

  void _showTopicOptions(BuildContext context, dynamic topic) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text("Topic Options"),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ElevatedButton(
                onPressed: () {
                  Navigator.pop(context); // Đóng dialog
                  _deleteTopic(context, topic['id'].toString());
                },
                child: Text("Delete Topic"),
              ),
            ],
          ),
        );
      },
    );
  }

  void _deleteTopic(BuildContext context, String topicId) async {
    print(topicId);
    String token = ''; // Lấy token từ Share Preference hoặc nơi lưu trữ khác
    await APIRepository().deleteTopic(topicId.toString(), token);
    setState(() {
      _topicListFuture = _fetchTopicList();
    });
    Navigator.pop(context); // Đóng dialog sau khi xóa chủ đề
  }

  void _navigateToTopicDetails(dynamic topic) {
// Chuyển qua màn hình chi tiết chủ đề và truyền thông tin chủ đề
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => TopicDetails(topic: topic),
      ),
    );
  }
}

class TopicDetails extends StatelessWidget {
  final dynamic topic;

  const TopicDetails({Key? key, required this.topic}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Topic Details'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('Topic Name: ${topic['topicName']}'),
            Text('Description: ${topic['description']}'),
          ],
        ),
      ),
    );
  }
}
