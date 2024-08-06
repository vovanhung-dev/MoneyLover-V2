import 'dart:math';
import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';
import '../data/api.dart';

class FlashcardWidget extends StatefulWidget {
  final List<dynamic> flashcards;

  const FlashcardWidget({Key? key, required this.flashcards}) : super(key: key);

  @override
  _FlashcardWidgetState createState() => _FlashcardWidgetState();
}

class _FlashcardWidgetState extends State<FlashcardWidget> with SingleTickerProviderStateMixin {
  int _currentIndex = 0;
  bool _isFront = true;
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(milliseconds: 500),
      vsync: this,
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _flipCard() {
    setState(() {
      _isFront = !_isFront;
    });
    _controller.forward().then((_) => _controller.reverse());
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        GestureDetector(
          onTap: _flipCard,
          child: AnimatedSwitcher(
            duration: Duration(milliseconds: 500),
            transitionBuilder: (Widget child, Animation<double> animation) {
              final rotate = Tween(begin: pi, end: 0.0).animate(animation);
              return AnimatedBuilder(
                animation: rotate,
                child: child,
                builder: (BuildContext context, Widget? child) {
                  final value = _isFront ? min(rotate.value, pi / 2) : rotate.value;
                  return Transform(
                    transform: Matrix4.rotationY(value),
                    child: child,
                    alignment: Alignment.center,
                  );
                },
              );
            },
            child: _isFront
                ? Card(
              key: ValueKey(true),
              child: Container(
                width: 300,
                height: 400,
                alignment: Alignment.center,
                child: Text(widget.flashcards[_currentIndex]['word'], style: TextStyle(fontSize: 24)),
              ),
            )
                : Card(
              key: ValueKey(false),
              child: Container(
                width: 300,
                height: 400,
                alignment: Alignment.center,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(widget.flashcards[_currentIndex]['word'], style: TextStyle(fontSize: 24)),
                    SizedBox(height: 20),
                    Text(widget.flashcards[_currentIndex]['definition'], style: TextStyle(fontSize: 18)),
                  ],
                ),
              ),
            ),
          ),
        ),
        SizedBox(height: 20),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            ElevatedButton(
              onPressed: () {
                setState(() {
                  _currentIndex = (_currentIndex - 1 + widget.flashcards.length) % widget.flashcards.length;
                  _isFront = true;
                });
              },
              child: Text('Previous'),
            ),
            ElevatedButton(
              onPressed: () {
                setState(() {
                  _currentIndex = (_currentIndex + 1) % widget.flashcards.length;
                  _isFront = true;
                });
              },
              child: Text('Next'),
            ),
          ],
        ),
        SizedBox(height: 20),
        ElevatedButton(
          onPressed: () {
            _updateVocabularyStatus(widget.flashcards[_currentIndex]['id'].toString(), 'learning');
          },
          child: Text('Mark as Learning'),
        ),
      ],
    );
  }

  Future<void> _updateVocabularyStatus(String vocabularyId, String status) async {
    try {
      await APIRepository().trackVocabularyStatus(vocabularyId, status);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Vocabulary status updated successfully"),
          duration: Duration(seconds: 5),
        ),
      );
    } catch (ex) {
      print(ex);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Failed to update vocabulary status"),
          duration: Duration(seconds: 5),
        ),
      );
    }
  }
}
