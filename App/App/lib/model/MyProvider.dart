import 'package:flutter/material.dart';

// Tạo một lớp mở rộng từ ChangeNotifier để làm Provider
class MyProvider extends ChangeNotifier {
  // Khai báo biến trạng thái và phương thức để cập nhật trạng thái
  String _someData = 'Initial Data';

  String get someData => _someData;

  void updateData(String newData) {
    _someData = newData;
    notifyListeners(); // Thông báo cho các widget con về sự thay đổi trong trạng thái
  }
}
