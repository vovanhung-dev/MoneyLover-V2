import 'package:flutter/material.dart';

class TypingSettings {
  int questionTime = 30; // Thời gian cho mỗi câu hỏi, mặc định là 30 giây

  TypingSettings({required this.questionTime});
}

class TypingSettingsPage extends StatefulWidget {
  final TypingSettings settings;
  final ValueChanged<TypingSettings> onChanged;

  const TypingSettingsPage({
    Key? key,
    required this.settings,
    required this.onChanged,
  }) : super(key: key);

  @override
  _TypingSettingsPageState createState() => _TypingSettingsPageState();
}

class _TypingSettingsPageState extends State<TypingSettingsPage> {
  late int _questionTime;

  @override
  void initState() {
    super.initState();
    _questionTime = widget.settings.questionTime;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Typing Settings'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Question Time (seconds)',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            Slider(
              value: _questionTime.toDouble(),
              min: 10,
              max: 60,
              divisions: 10,
              label: _questionTime.toString(),
              onChanged: (value) {
                setState(() {
                  _questionTime = value.toInt();
                });
              },
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                widget.onChanged(TypingSettings(questionTime: _questionTime));
                Navigator.pop(context);
              },
              child: Text('Save Settings'),
            ),
          ],
        ),
      ),
    );
  }
}
