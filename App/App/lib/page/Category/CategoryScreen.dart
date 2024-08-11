import 'package:flutter/material.dart';
import '../../data/CategoryAPI.dart';
import '../../data/api.dart';
import '../../model/Category.dart';
import 'CreateCategoryScreen.dart';

class CategoryScreen extends StatefulWidget {
  @override
  _CategoryScreenState createState() => _CategoryScreenState();
}

class _CategoryScreenState extends State<CategoryScreen> {
  late CategoryAPI categoryAPI;
  late Future<List<Category>> _categoriesFuture;

  @override
  void initState() {
    super.initState();
    categoryAPI = CategoryAPI(API());
    _categoriesFuture = categoryAPI.fetchAllCategories();
  }

  void _navigateToCreateCategory() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => CreateCategoryScreen()),
    ).then((_) {
      setState(() {
        _categoriesFuture = categoryAPI.fetchAllCategories();
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.teal,
        title: const Text('Categories', style: TextStyle(color: Colors.white)),
        actions: [
          IconButton(
            icon: Icon(Icons.add, size: 30, color: Colors.white),
            onPressed: _navigateToCreateCategory,
          ),
        ],
      ),
      body: FutureBuilder<List<Category>>(
        future: _categoriesFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text('No categories available.'));
          } else {
            final categories = snapshot.data!;
            return ListView.builder(
              padding: EdgeInsets.all(8.0),
              itemCount: categories.length,
              itemBuilder: (context, index) {
                final category = categories[index];
                return Card(
                  elevation: 6,
                  margin: EdgeInsets.symmetric(vertical: 8.0),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16.0),
                  ),
                  color: Colors.teal[50],
                  child: ListTile(
                    contentPadding: EdgeInsets.all(16.0),
                    leading: category.categoryIcon != null
                        ? ClipRRect(
                      borderRadius: BorderRadius.circular(8.0),
                      child: Image.network(
                        category.categoryIcon!,
                        width: 50,
                        height: 50,
                        fit: BoxFit.cover,
                      ),
                    )
                        : CircleAvatar(
                      backgroundColor: Colors.teal,
                      child: Icon(Icons.category, size: 30, color: Colors.white),
                    ),
                    title: Text(
                      category.name,
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 18.0,
                        color: Colors.teal[800],
                      ),
                    ),
                    subtitle: Text(
                      category.categoryType ?? 'No type specified',
                      style: TextStyle(color: Colors.teal[600]),
                    ),
                    onTap: () {
                      // Handle category tap if needed
                    },
                  ),
                );
              },
            );
          }
        },
      ),
    );
  }
}
