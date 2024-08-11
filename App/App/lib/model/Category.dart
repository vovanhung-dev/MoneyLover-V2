class Category {
  final String id;
  final String name;
  final String? categoryIcon; // This can be null
  final String? categoryType; // This can be null

  Category({
    required this.id,
    required this.name,
    this.categoryIcon,
    this.categoryType,
  });

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'],
      name: json['name'],
      categoryIcon: json['categoryIcon'] as String?, // Handle null
      categoryType: json['categoryType'] as String?, // Handle null
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'categoryIcon': categoryIcon,
      'categoryType': categoryType,
    };
  }

  @override
  String toString() {
    return 'Category(name: $name, categoryIcon: $categoryIcon, categoryType: $categoryType, id: $id)';
  }
}
