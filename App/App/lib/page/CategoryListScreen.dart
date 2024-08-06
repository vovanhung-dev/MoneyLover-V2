import 'package:flutter/material.dart';
import '../data/api.dart';
import 'VocabularyScreen.dart';

class CategoryListScreen extends StatefulWidget {
  @override
  _CategoryListScreenState createState() => _CategoryListScreenState();
}

class _CategoryListScreenState extends State<CategoryListScreen> {
  final APIRepository _apiRepository = APIRepository();
  List<dynamic> _categories = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchCategories();
  }

  Future<void> _fetchCategories() async {
    setState(() {
      _isLoading = true;
    });

    try {
      List<dynamic> categories = await _apiRepository.getAllCategories();
      setState(() {
        _categories = categories;
        _isLoading = false;
      });
    } catch (e) {
      print("Failed to fetch categories: $e");
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : ListView.builder(
        itemCount: _categories.length,
        itemBuilder: (context, index) {
          var category = _categories[index];
          return GestureDetector(
            onTap: () async {
              String categoryId = category['id'].toString();
              List<dynamic> vocabularies = await _apiRepository.getVocabulariesByCategory(categoryId);

              print(vocabularies);
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => VocabularyScreen(vocabularies),
                ),
              );
            },
            child: Card(
              elevation: 4,
              margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Row(
                  children: [
                    category['image'] != null
                        ? ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.network(
                        category['image'],
                        width: 80,
                        height: 80,
                        fit: BoxFit.cover,
                      ),
                    )
                        : Icon(Icons.category, size: 80, color: Colors.grey),
                    SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            category['name'] ?? 'No Name',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: 8),
                          Text(
                            category['description'] ?? 'No Description',
                            style: TextStyle(
                              fontSize: 16,
                              color: Colors.grey[600],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
