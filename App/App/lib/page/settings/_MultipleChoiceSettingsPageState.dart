import 'package:flutter/material.dart';

// Tạo một lớp để lưu trữ các cài đặt cho bài kiểm tra multiple choice
class MultipleChoiceSettings {
  final int questionTime; // Thời gian cho mỗi câu hỏi
  final int numberOfQuestions; // Số lượng câu hỏi

  MultipleChoiceSettings({
    required this.questionTime,
    required this.numberOfQuestions,
  });
}

// Trang cài đặt cho bài kiểm tra multiple choice
class MultipleChoiceSettingsPage extends StatefulWidget {
  final MultipleChoiceSettings settings;
  final ValueChanged<MultipleChoiceSettings> onChanged;

  const MultipleChoiceSettingsPage({
    Key? key,
    required this.settings,
    required this.onChanged,
  }) : super(key: key);

  @override
  _MultipleChoiceSettingsPageState createState() =>
      _MultipleChoiceSettingsPageState();
}

class _MultipleChoiceSettingsPageState
    extends State<MultipleChoiceSettingsPage> {
  late TextEditingController _questionTimeController;
  late TextEditingController _numberOfQuestionsController;

  @override
  void initState() {
    super.initState();
    _questionTimeController =
        TextEditingController(text: widget.settings.questionTime.toString());
    _numberOfQuestionsController = TextEditingController(
        text: widget.settings.numberOfQuestions.toString());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Multiple Choice Settings'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Question Time (seconds):',
              style: TextStyle(fontSize: 18),
            ),
            TextField(
              controller: _questionTimeController,
              keyboardType: TextInputType.number,
            ),
            SizedBox(height: 20),
            Text(
              'Number of Questions:',
              style: TextStyle(fontSize: 18),
            ),
            TextField(
              controller: _numberOfQuestionsController,
              keyboardType: TextInputType.number,
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                _saveSettings();
              },
              child: Text('Save Settings'),
            ),
          ],
        ),
      ),
    );
  }

  void _saveSettings() {
    final questionTime =
        int.tryParse(_questionTimeController.text) ?? widget.settings.questionTime;
    final numberOfQuestions = int.tryParse(_numberOfQuestionsController.text) ??
        widget.settings.numberOfQuestions;

    widget.onChanged(
      MultipleChoiceSettings(
        questionTime: questionTime,
        numberOfQuestions: numberOfQuestions,
      ),
    );

    Navigator.pop(context);
  }
}
