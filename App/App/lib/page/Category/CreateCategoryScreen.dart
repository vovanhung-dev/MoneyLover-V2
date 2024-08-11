import 'package:flutter/material.dart';
import '../../data/CategoryAPI.dart';
import '../../data/api.dart';
import '../../model/Category.dart';
import '../../model/CategoryCreate.dart';

class CreateCategoryScreen extends StatefulWidget {
  @override
  _CreateCategoryScreenState createState() => _CreateCategoryScreenState();
}

class _CreateCategoryScreenState extends State<CreateCategoryScreen> {
  late CategoryAPI categoryAPI;
  late Future<List<Map<String, dynamic>>> _iconsFuture;
  final _nameController = TextEditingController();
  String? _selectedIconUrl;
  String _selectedCategoryType = 'Expense'; // Default category type

  @override
  void initState() {
    super.initState();
    // Initialize Dio and CategoryAPI
    categoryAPI = CategoryAPI(API());

    // Fetch icons
    _iconsFuture = categoryAPI.fetchIcons();
  }

  void _createCategory() async {
    final name = _nameController.text;
    if (name.isEmpty || _selectedIconUrl == null) {
      // Handle invalid input
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please provide a name and select an icon.')),
      );
      return;
    }

    final category = CategoryCreate(
      name: name,
      icon: _selectedIconUrl,
      type: _selectedCategoryType,
      id: '', // Assuming ID is generated server-side
    );

    print('Creating Category: $category');


    final result = await categoryAPI.createCategory(category);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(result)),
    );

    if (result == "Category added successfully") {
      Navigator.pop(context); // Go back to the previous screen
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Create Category'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextField(
              controller: _nameController,
              decoration: InputDecoration(labelText: 'Category Name'),
            ),
            SizedBox(height: 20),
            DropdownButton<String>(
              value: _selectedCategoryType,
              onChanged: (String? newValue) {
                setState(() {
                  _selectedCategoryType = newValue!;
                });
              },
              items: <String>['Expense', 'Income', 'Debt_Loan']
                  .map<DropdownMenuItem<String>>((String value) {
                return DropdownMenuItem<String>(
                  value: value,
                  child: Text(value),
                );
              }).toList(),
            ),
            SizedBox(height: 20),
            FutureBuilder<List<Map<String, dynamic>>>(
              future: _iconsFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Center(child: Text('Error: ${snapshot.error}'));
                } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return const Center(child: Text('No icons available.'));
                } else {
                  final icons = snapshot.data!;
                  return Expanded(
                    child: GridView.builder(
                      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 3,
                        crossAxisSpacing: 8.0,
                        mainAxisSpacing: 8.0,
                      ),
                      itemCount: icons.length,
                      itemBuilder: (context, index) {
                        final icon = icons[index];
                        return GestureDetector(
                          onTap: () {
                            setState(() {
                              _selectedIconUrl = icon['path'];
                            });
                          },
                          child: GridTile(
                            child: Image.network(icon['path']),
                            footer: _selectedIconUrl == icon['path']
                                ? Container(
                              color: Colors.black54,
                              child: Center(
                                child: Icon(
                                  Icons.check,
                                  color: Colors.white,
                                ),
                              ),
                            )
                                : null,
                          ),
                        );
                      },
                    ),
                  );
                }
              },
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: _createCategory,
              child: const Text('Create Category'),
            ),
          ],
        ),
      ),
    );
  }
}