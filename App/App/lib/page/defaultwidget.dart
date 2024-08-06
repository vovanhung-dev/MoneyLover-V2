import 'package:flutter/material.dart';

class DefaultWidget extends StatelessWidget {
  const DefaultWidget({super.key, required this.title, required this.widget});
  final String title;
  final Widget widget;
  // khi dùng tham số truyền vào phải khai báo biến trùng tên require
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: widget,
    );
  }
}
