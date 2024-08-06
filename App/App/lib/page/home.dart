import 'package:flutter/material.dart';
import '../../data/api.dart';
import '../data/sharepre.dart';
import '../model/user.dart';
import 'TopicManagement.dart';

class FolderManagement extends StatefulWidget {
  const FolderManagement({Key? key}) : super(key: key);

  @override
  State<FolderManagement> createState() => _FolderManagementState();
}

class _FolderManagementState extends State<FolderManagement> {
  late Future<List<dynamic>> _folderListFuture;
  String? folderName;

  @override
  void initState() {
    super.initState();
    _folderListFuture = _fetchFolderList();
  }

  Future<List<dynamic>> _fetchFolderList() async {
    // Gọi API để lấy danh sách thư mục
    String token = ''; // Lấy token từ Share Preference hoặc nơi lưu trữ khác
    User? user = await getUser();

    return APIRepository().getFoldersByUserId(user.id!);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: FutureBuilder<List<dynamic>>(
        future: _folderListFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          } else {
            List<dynamic> folderList = snapshot.data!;
            return ListView.builder(
              itemCount: folderList.length,
              itemBuilder: (context, index) {
                dynamic folder = folderList[index];
                return Card(
                  margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: ListTile(
                    title: Text(folder['name']),
                    onTap: () {
                      _navigateToTopicManagement(folder['id'].toString());
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
          _createFolder();
        },
        child: Icon(Icons.add),
      ),
    );
  }

  void _navigateToTopicManagement(String folderId) async {
    // Lấy danh sách chủ đề của thư mục được chọn
    // Chuyển qua màn hình TopicManagement và truyền danh sách chủ đề cùng với ID của thư mục
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => TopicManagement(folderId: folderId.toString()),
      ),
    );
  }

  // Hàm hiển thị các tùy chọn cho thư mục (cập nhật, xóa)
  void _showFolderOptions(dynamic folder) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text("Folder Options"),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ElevatedButton(
                onPressed: () {
                  Navigator.pop(context); // Đóng dialog
                  _updateFolder(folder);
                },
                child: const Text("Update Folder"),
              ),
              ElevatedButton(
                onPressed: () {
                  Navigator.pop(context); // Đóng dialog
                  _deleteFolder(folder);
                },
                child: const Text("Delete Folder"),
              ),
            ],
          ),
        );
      },
    );
  }

  // Hàm tạo thư mục mới
  void _createFolder() async {
    String token = ''; // Lấy token từ Share Preference hoặc nơi lưu trữ khác
    // Hiển thị dialog để nhập thông tin thư mục mới
    folderName = await showDialog<String>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text("Create Folder"),
          content: TextField(
            onChanged: (value) => folderName = value.trim(), // Lưu giá trị vào folderName
            decoration: const InputDecoration(hintText: "Enter folder name"),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context), // Đóng dialog
              child: const Text("Cancel"),
            ),
            ElevatedButton(
              onPressed: () async {
                Navigator.pop(context, folderName); // Trả về giá trị folderName
              },
              child: const Text("Create"),
            ),
          ],
        );
      },
    );
    // Kiểm tra nếu có tên thư mục, gọi API để tạo thư mục mới
    if (folderName != null && folderName!.isNotEmpty) {
      User? user = await getUser();
      await APIRepository().createFolder(user!.id!, folderName!, token); // Sử dụng giá trị từ folderName
      // Cập nhật lại danh sách thư mục sau khi tạo mới
      setState(() {
        _folderListFuture = _fetchFolderList();
      });
    }
  }

  void _updateFolder(dynamic folder) async {
    String token = ''; // Lấy token từ Share Preference hoặc nơi lưu trữ khác
    TextEditingController folderNameController = TextEditingController(text: folder['name']);
    String? newFolderName = await showDialog<String>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text("Update Folder"),
          content: TextField(
            controller: folderNameController,
            onChanged: (value) => value.trim(),
            decoration: const InputDecoration(hintText: "Enter new folder name"),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context), // Đóng dialog
              child: const Text("Cancel"),
            ),
            ElevatedButton(
              onPressed: () async {
                String updatedFolderName = folderNameController.text.trim(); // Lấy tên thư mục mới từ controller
                Navigator.pop(context, updatedFolderName);
              },
              child: const Text("Update"),
            ),
          ],
        );
      },
    );
    // Kiểm tra nếu có tên thư mục mới, gọi API để cập nhật
    if (newFolderName != null && newFolderName.isNotEmpty) {
      String folderId = folder['id'].toString(); // Lấy ID của thư mục cần cập nhật
      await APIRepository().updateFolder(folderId, newFolderName, token); // Truyền ID vào API để cập nhật
      // Cập nhật lại danh sách thư mục sau khi cập nhật
      setState(() {
        _folderListFuture = _fetchFolderList();
      });
    }
  }

  // Hàm xóa thư mục
  void _deleteFolder(dynamic folder) async {
    String folderId = folder['id'].toString();
    await APIRepository().deleteFolder(folderId, "");
    // Cập nhật lại danh sách thư mục sau khi xóa
    setState(() {
      _folderListFuture = _fetchFolderList();
    });
  }
}
