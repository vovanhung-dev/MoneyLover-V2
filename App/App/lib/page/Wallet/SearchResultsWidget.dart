import 'package:flutter/material.dart';

class SearchResultsWidget extends StatelessWidget {
  final List<Map<String, dynamic>> searchResults;
  final Function(String) onAddManager;

  SearchResultsWidget({
    required this.searchResults,
    required this.onAddManager,
  });

  @override
  Widget build(BuildContext context) {
    // Print the search results for debugging
    print('SearchResultsWidget data: $searchResults');

    return searchResults.isEmpty
        ? Center(child: Text('No results found'))
        : Column(
      children: searchResults.map((user) {
        // Print individual user data for debugging
        print('User data: $user');

        return ListTile(
          title: Text(user['username'] as String),
          subtitle: Text(user['email'] as String),
          trailing: TextButton(
            onPressed: () {
              print('Adding user with ID: ${user['id']}'); // Debugging when add is pressed
              onAddManager(user['id'] as String);
              Navigator.of(context).pop();
            },
            child: Text('Add'),
          ),
        );
      }).toList(),
    );
  }
}
