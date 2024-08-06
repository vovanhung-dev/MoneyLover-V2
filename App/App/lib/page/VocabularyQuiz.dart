import 'dart:async';

import 'package:flutter/material.dart';
import 'package:shoehubapp/page/settings/TypingSettingsPage.dart';
import 'package:shoehubapp/page/settings/_MultipleChoiceSettingsPageState.dart';

class VocabularyQuiz extends StatefulWidget {
  final List<dynamic> vocabularies;

  const VocabularyQuiz({Key? key, required this.vocabularies}) : super(key: key);

  @override
  _VocabularyQuizState createState() => _VocabularyQuizState();
}

class _VocabularyQuizState extends State<VocabularyQuiz> {
  int _currentIndex = 0;
  bool _showAnswer = false;
  late MultipleChoiceSettings _settings;
  late Timer _timer;
  int _remainingTime = 0;

  @override
  void initState() {
    super.initState();
    _settings = MultipleChoiceSettings(questionTime: 30, numberOfQuestions: 10);
    _startTimer();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Vocabulary Quiz'),
        actions: [
          IconButton(
            icon: Icon(Icons.settings),
            onPressed: () {
              _openSettingsPage(context);
            },
          ),
        ],
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Card(
            elevation: 4,
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    widget.vocabularies[_currentIndex]['word'],
                    style: TextStyle(fontSize: 24),
                  ),
                  SizedBox(height: 20),
                  Text(
                    _remainingTime.toString(),
                    style: TextStyle(fontSize: 20),
                  ),
                  SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: () {
                      setState(() {
                        _showAnswer = true;
                      });
                    },
                    child: Text('Show Answer'),
                  ),
                  if (_showAnswer) ...[
                    SizedBox(height: 20),
                    Text(
                      widget.vocabularies[_currentIndex]['definition'],
                      style: TextStyle(fontSize: 18),
                    ),
                    SizedBox(height: 20),
                    ElevatedButton(
                      onPressed: _nextQuestion,
                      child: Text('Next Question'),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  void _nextQuestion() {
    setState(() {
      _currentIndex = (_currentIndex + 1) % widget.vocabularies.length;
      _showAnswer = false;
      _startTimer(); // Bắt đầu đếm ngược cho câu hỏi mới
    });
  }

  void _openSettingsPage(BuildContext context) async {
    final newSettings = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => MultipleChoiceSettingsPage(
          settings: _settings,
          onChanged: (settings) {
            setState(() {
              _settings = settings;
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

  void _startTimer() {
    _remainingTime = _settings.questionTime;
    _timer = Timer.periodic(Duration(seconds: 1), (timer) {
      setState(() {
        if (_remainingTime > 0) {
          _remainingTime--;
        } else {
          _timer.cancel();
          _showAnswer = true;
        }
      });
    });
  }

  @override
  void dispose() {
    _timer.cancel(); // Hủy đối tượng Timer khi widget bị hủy
    super.dispose();
  }
}
