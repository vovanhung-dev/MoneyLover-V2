import 'package:flutter/material.dart';
import 'package:audioplayers/audioplayers.dart';

class VocabularyScreen extends StatefulWidget {
  final List<dynamic> vocabularies;

  VocabularyScreen(this.vocabularies);

  @override
  _VocabularyScreenState createState() => _VocabularyScreenState();
}

class _VocabularyScreenState extends State<VocabularyScreen> {
  int _currentIndex = 0;
  bool _showDefinition = false;
  bool _isTypingMode = false;
  late AudioPlayer _audioPlayer;
  final TextEditingController _textEditingController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _audioPlayer = AudioPlayer();
  }

  @override
  void dispose() {
    _audioPlayer.dispose();
    _textEditingController.dispose();
    super.dispose();
  }

  void _toggleCard() {
    setState(() {
      _showDefinition = !_showDefinition;
    });
  }

  Future<void> _playAudio(String audioUrl) async {
    await _audioPlayer.play(UrlSource(audioUrl));
  }

  void _checkAnswer(String input) {
    var vocabulary = widget.vocabularies[_currentIndex];
    bool isCorrect = input.trim().toLowerCase() == vocabulary['word'].toString().toLowerCase();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(isCorrect ? 'Correct!' : 'Incorrect'),
        content: Text(isCorrect ? 'Great job!' : 'The correct answer is: ${vocabulary['word']}'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              setState(() {
                _currentIndex = (_currentIndex + 1) % widget.vocabularies.length;
                _textEditingController.clear();
                _showDefinition = false;
              });
            },
            child: Text('Next'),
          ),
        ],
      ),
    );
  }

  void _switchMode() {
    setState(() {
      _isTypingMode = !_isTypingMode;
    });
  }

  @override
  Widget build(BuildContext context) {
    var vocabulary = widget.vocabularies.isEmpty ? null : widget.vocabularies[_currentIndex];

    return Scaffold(
      appBar: AppBar(
        title: Text('Vocabularies'),
        actions: [
          IconButton(
            icon: Icon(_isTypingMode ? Icons.view_carousel : Icons.keyboard),
            onPressed: _switchMode,
          ),
        ],
      ),
      body: _buildBody(vocabulary),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          setState(() {
            _currentIndex = (_currentIndex + 1) % widget.vocabularies.length;
            _showDefinition = false;
          });
        },
        child: Icon(Icons.arrow_forward),
      ),
    );
  }

  Widget _buildBody(Map<String, dynamic>? vocabulary) {
    if (vocabulary == null) {
      return Center(
        child: Text('Topic không có từ vựng'),
      );
    }

    return Container(
      width: double.infinity,
      height: double.infinity,
      color: Colors.white,
      child: Center(
        child: _isTypingMode ? _buildTypingMode(vocabulary) : _buildFlashCardMode(vocabulary),
      ),
    );
  }

  Widget _buildFlashCardMode(Map<String, dynamic> vocabulary) {
    return GestureDetector(
      onTap: _toggleCard,
      child: AnimatedSwitcher(
        duration: Duration(milliseconds: 300),
        child: _showDefinition ? _buildDefinition(vocabulary) : _buildWord(vocabulary),
      ),
    );
  }

  Widget _buildTypingMode(Map<String, dynamic> vocabulary) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        ElevatedButton(
          onPressed: () {
            _playAudio(vocabulary['audioURL']);
          },
          child: Icon(Icons.volume_up),
        ),
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: TextField(
            controller: _textEditingController,
            decoration: InputDecoration(
              border: OutlineInputBorder(),
              labelText: 'Type the word you hear',
            ),
            onSubmitted: _checkAnswer,
          ),
        ),
        ElevatedButton(
          onPressed: () {
            _checkAnswer(_textEditingController.text);
          },
          child: Text('Submit'),
        ),
      ],
    );
  }

  Widget _buildWord(Map<String, dynamic> vocabulary) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.white,
      ),
      child: Card(
        elevation: 4,
        margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (vocabulary['imageURL'] != null)
              Padding(
                padding: EdgeInsets.all(8),
                child: Image.network(
                  vocabulary['imageURL'],
                  height: 200,
                ),
              ),
            Padding(
              padding: EdgeInsets.all(8),
              child: Text(
                vocabulary['description'],
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 18),
              ),
            ),
            Padding(
              padding: EdgeInsets.all(8),
              child: ElevatedButton(
                onPressed: () {
                  _playAudio(vocabulary['audioURL']);
                },
                child: Icon(Icons.volume_up),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDefinition(Map<String, dynamic> vocabulary) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.white,
      ),
      child: Card(
        elevation: 4,
        margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Padding(
              padding: EdgeInsets.all(8),
              child: Text(
                vocabulary['word'],
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
            ),
            Padding(
              padding: EdgeInsets.all(8),
              child: Text(
                vocabulary['pronunciation'],
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 18),
              ),
            ),
            Padding(
              padding: EdgeInsets.all(8),
              child: Text(
                vocabulary['meaning'],
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 18),
              ),
            ),
            Padding(
              padding: EdgeInsets.all(8),
              child: ElevatedButton(
                onPressed: () {
                  _playAudio(vocabulary['audioURL']);
                },
                child: Icon(Icons.volume_up),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
