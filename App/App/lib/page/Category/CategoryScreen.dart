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
    // Initialize Dio and CategoryAPI
    categoryAPI = CategoryAPI(API());
    _categoriesFuture = categoryAPI.fetchAllCategories(); // Fetch all categories
  }

  void _navigateToCreateCategory() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => CreateCategoryScreen()),
    ).then((_) {
      // Refresh the category list after returning from CreateCategoryScreen
      setState(() {
        _categoriesFuture = categoryAPI.fetchAllCategories();
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Categories'),
        actions: [
          IconButton(
            icon: Icon(Icons.add),
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
              itemCount: categories.length,
              itemBuilder: (context, index) {
                final category = categories[index];
                return ListTile(
                  leading: category.categoryIcon != null
                      ? Image.network(
                    category.categoryIcon!, // Display icon if available
                  )
                      : null,
                  title: Text(category.name), // Display category name
                  subtitle: Text(category.categoryType ?? ''), // Display category type if available
                  onTap: () {
                    // Handle category tap if needed
                    // For example, navigate to another screen with details
                  },
                );
              },
            );
          }
        },
      ),
    );
  }
}
