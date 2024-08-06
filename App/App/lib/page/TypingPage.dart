import 'dart:async';

import 'package:flutter/material.dart';
import 'package:shoehubapp/page/settings/TypingSettingsPage.dart';

class TypingPage extends StatefulWidget {
  final List<dynamic> vocabularies;

  const TypingPage({Key? key, required this.vocabularies}) : super(key: key);

  @override
  _TypingPageState createState() => _TypingPageState();
}

class _TypingPageState extends State<TypingPage> {
  int _currentIndex = 0;
  TextEditingController _textEditingController = TextEditingController();
  String _result = '';
  late TypingSettings _settings;
  late Timer _timer;
  int _remainingTime = 0;

  @override
  void initState() {
    super.initState();
    _settings = TypingSettings(questionTime: 30);
    _startTimer();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Learn Vocabulary by Typing'),
        actions: [
          IconButton(
            onPressed: () {
              _openSettingsPage(context);
            },
            icon: Icon(Icons.settings),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              widget.vocabularies[_currentIndex]['definition'],
              style: TextStyle(fontSize: 20),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 20),
            TextField(
              enabled: _remainingTime > 0, // Ngăn không cho nhập nếu thời gian đã hết
              controller: _textEditingController,
              decoration: InputDecoration(
                labelText: 'Type the word here',
                border: OutlineInputBorder(),
              ),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                _checkAnswer();
              },
              child: Text('Check Answer'),
            ),
            SizedBox(height: 20),
            Text(
              _result,
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 20),
            if (_remainingTime > 0) // Hiển thị thời gian đếm ngược nếu vẫn còn thời gian
              Text(
                'Time remaining: $_remainingTime seconds',
                style: TextStyle(fontSize: 16),
              ),
            SizedBox(height: 20),
            if (_result.isNotEmpty) // Hiển thị nút Next Question nếu đã kiểm tra đáp án
              ElevatedButton(
                onPressed: () {
                  _nextQuestion();
                },
                child: Text('Next Question'),
              ),
          ],
        ),
      ),
    );
  }

  void _startTimer() {
    _remainingTime = _settings.questionTime;
    _timer = Timer.periodic(Duration(seconds: 1), (timer) {
      setState(() {
        if (_remainingTime > 0) {
          _remainingTime--;
        } else {
          _timer.cancel();
          _checkAnswer();
        }
      });
    });
  }

  void _checkAnswer() {
    _timer.cancel(); // Dừng đếm ngược khi kiểm tra kết quả
    String typedWord = _textEditingController.text.trim();
    String correctWord = widget.vocabularies[_currentIndex]['word'];

    if (_remainingTime > 0) {
      if (typedWord.toLowerCase() == correctWord.toLowerCase()) {
        setState(() {
          _result = 'Correct!';
        });
      } else {
        setState(() {
          _result = 'Incorrect. The correct word is: $correctWord';
        });
      }
    } else {
      setState(() {
        _result = 'Time is up. The correct word is: $correctWord';
      });
    }
  }

  void _nextQuestion() {
    _timer.cancel(); // Dừng đếm ngược trước khi chuyển câu hỏi
    setState(() {
      _currentIndex = (_currentIndex + 1) % widget.vocabularies.length;
      _result = ''; // Xóa kết quả hiển thị khi chuyển sang câu hỏi mới
      _textEditingController.clear(); // Xóa nội dung trong ô nhập liệu
      _startTimer(); // Bắt đầu đếm ngược cho câu hỏi mới
    });
  }

  void _openSettingsPage(BuildContext context) async {
    final newSettings = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => TypingSettingsPage(
          settings: _settings,
          onChanged: (settings) {
            setState(() {
              _settings = settings;
              _remainingTime = _settings.questionTime; // Cập nhật lại thời gian còn lại khi thay đổi cài đặt
            });
          },
        ),
      ),
    );

    if (newSettings != null) {
      setState(() {
        _settings = newSettings;
      });
    }
  }

  @override
  void dispose() {
    _timer.cancel(); // Hủy đối tượng Timer khi widget bị hủy
    super.dispose();
  }
}
