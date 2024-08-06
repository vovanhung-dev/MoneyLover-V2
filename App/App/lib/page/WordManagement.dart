import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';
import '../data/api.dart';
import 'FlashcardWidget.dart';
import 'TypingPage.dart';
import 'VocabularyQuiz.dart'; // Thêm import cho VocabularyQuiz

class WordManagement extends StatefulWidget {
  final String topicId;

  const WordManagement({Key? key, required this.topicId}) : super(key: key);

  @override
  _WordManagementState createState() => _WordManagementState();
}

class _WordManagementState extends State<WordManagement> {
  late Future<List<dynamic>> _vocabulariesFuture;
  final TextEditingController _wordController = TextEditingController();
  final TextEditingController _definitionController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _vocabulariesFuture = _fetchVocabularies();
  }

  Future<List<dynamic>> _fetchVocabularies() async {
    try {
      return await APIRepository().getAllVocabulariesInTopic(widget.topicId);
    } catch (ex) {
      print(ex);
      throw Exception('Failed to fetch vocabularies in topic');
    }
  }

  Future<void> _exportToCSV(List<dynamic> vocabularies) async {
    try {
      Directory documentsDirectory = await getApplicationDocumentsDirectory();
      String filePath = '${documentsDirectory.path}/vocabularies.csv';

      File csvFile = File(filePath);
      IOSink csvSink = csvFile.openWrite();

      for (var vocabulary in vocabularies) {
        csvSink.writeln('${vocabulary['word']},${vocabulary['definition']},${vocabulary['status']}');
      }

      await csvSink.close();

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("CSV file exported successfully: $filePath"),
          duration: Duration(seconds: 5),
        ),
      );
    } catch (ex) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Failed to export CSV file"),
          duration: Duration(seconds: 5),
        ),
      );
      print('Error exporting CSV file: $ex');
    }
  }

  Widget _buildStatusIndicator(String status) {
    switch (status) {
      case 'not_learned':
        return Icon(Icons.sentiment_neutral);
      case 'learning':
        return Icon(Icons.check_circle);
      case 'learned':
        return Icon(Icons.star);
      default:
        return Container();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Word Management'),
        actions: [
          IconButton(
            icon: Icon(Icons.file_download),
            onPressed: () {
              _vocabulariesFuture.then((vocabularies) {
                _exportToCSV(vocabularies);
              });
            },
          ),
          IconButton(
            icon: Icon(Icons.book),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => FlashcardPage(topicId: widget.topicId),
                ),
              );
            },
          ),
          IconButton( // Thêm nút cho bài kiểm tra từ vựng
            icon: Icon(Icons.quiz),
            onPressed: () {
              _vocabulariesFuture.then((vocabularies) {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => VocabularyQuiz(vocabularies: vocabularies),
                  ),
                );
              });
            },
          ),
          IconButton( // Thêm nút cho bài kiểm tra từ vựng
            icon: Icon(Icons.question_answer),
            onPressed: () {
              _vocabulariesFuture.then((vocabularies) {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => TypingPage(vocabularies: vocabularies),
                  ),
                );
              });
            },
          ),

        ],
      ),
      body: FutureBuilder<List<dynamic>>(
        future: _vocabulariesFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          } else {
            List<dynamic> vocabularies = snapshot.data!;
            return ListView.builder(
              itemCount: vocabularies.length,
              itemBuilder: (context, index) {
                dynamic vocabulary = vocabularies[index];
                return ListTile(
                  title: Text(vocabulary['word']),
                  subtitle: Text(vocabulary['definition']),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      IconButton(
                        icon: Icon(Icons.delete),
                        onPressed: () {
                          _deleteVocabulary(vocabulary['id'].toString());
                        },
                      ),
                      IconButton(
                        icon: Icon(Icons.star_border),
                        onPressed: () {
                          _markVocabularyImportant(vocabulary['id'].toString(), true);
                        },
                      ),
                      PopupMenuButton<String>(
                        icon: Icon(Icons.more_vert),
                        itemBuilder: (context) => [
                          PopupMenuItem(
                            value: 'not_learned',
                            child: Text('Not yet learned'),
                          ),
                          PopupMenuItem(
                            value: 'learning',
                            child: Text('Learned'),
                          ),
                          PopupMenuItem(
                            value: 'learned',
                            child: Text('Memorized'),
                          ),
                        ],
                        onSelected: (String status) {
                          _updateVocabularyStatus(vocabulary['id'].toString(), status);
                        },
                      ),
                      SizedBox(width: 10),
                      _buildStatusIndicator(vocabulary['status']),
                    ],
                  ),
                );
              },
            );
          }
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          _showAddVocabularyDialog(context);
        },
        child: Icon(Icons.add),
      ),
    );
  }

  void _showAddVocabularyDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text("Add Vocabulary"),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: _wordController,
                decoration: InputDecoration(labelText: "Word"),
              ),
              TextField(
                controller: _definitionController,
                decoration: InputDecoration(labelText: "Definition"),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: Text("Cancel"),
            ),
            ElevatedButton(
              onPressed: () {
                _addVocabulary(context);
              },
              child: Text("Add"),
            ),
          ],
        );
      },
    );
  }

  void _addVocabulary(BuildContext context) async {
    String word = _wordController.text.trim();
    String definition = _definitionController.text.trim();

    if (word.isNotEmpty && definition.isNotEmpty) {
      try {
        await APIRepository().addVocabularyToTopic(widget.topicId, word, definition);
        setState(() {
          _vocabulariesFuture = _fetchVocabularies();
        });
        Navigator.pop(context);
      } catch (ex) {
        print(ex);
      }
    }
  }

  void _deleteVocabulary(String vocabularyId) async {
    try {
      await APIRepository().deleteVocabularyFromTopic(vocabularyId);
      setState(() {
        _vocabulariesFuture = _fetchVocabularies();
      });
    } catch (ex) {
      print(ex);
    }
  }

  void _markVocabularyImportant(String vocabularyId, bool isImportant) async {
    try {
      await APIRepository().markVocabularyImportant(vocabularyId, isImportant);
      setState(() {
        _vocabulariesFuture = _fetchVocabularies();
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Vocabulary marked as important successfully"),
          duration: Duration(seconds: 5),
        ),
      );
    } catch (ex) {
      print(ex);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Failed to mark vocabulary as important"),
          duration: Duration(seconds: 5),
        ),
      );
    }
  }

  void _updateVocabularyStatus(String vocabularyId, String status) async {
    try {
      await APIRepository().trackVocabularyStatus(vocabularyId, status);
      setState(() {
        _vocabulariesFuture = _fetchVocabularies();
      });
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

class FlashcardPage extends StatelessWidget {
  final String topicId;

  const FlashcardPage({Key? key, required this.topicId}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Flashcards'),
      ),
      body: FutureBuilder<List<dynamic>>(
        future: APIRepository().getAllVocabulariesInTopic(topicId),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          } else {
            List<dynamic> vocabularies = snapshot.data!;
            return Column(
              children: [
                ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => VocabularyQuiz(vocabularies: vocabularies),
                      ),
                    );
                  },
                  child: Text('Start Quiz'),
                ),
                SizedBox(height: 30),
                FlashcardWidget(flashcards: vocabularies),
              ],
            );

          }
        },
      ),
    );
  }
}
