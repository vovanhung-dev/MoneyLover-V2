class CategoryCreate {
  final String id;
  final String name;
  final String? icon; // This can be null
  final String? type; // This can be null

  CategoryCreate({
    required this.id,
    required this.name,
    this.icon,
    this.type,
  });

  factory CategoryCreate.fromJson(Map<String, dynamic> json) {
    return CategoryCreate(
      id: json['id'],
      name: json['name'],
      icon: json['icon'] as String?, // Handle null
      type: json['type'] as String?, // Handle null
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'icon': icon,
      'type': type,
    };
  }

  @override
  String toString() {
    return 'Category(name: $name, categoryIcon: $icon, categoryType: $type, id: $id)';
  }
}
