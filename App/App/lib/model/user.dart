class User {
  String? id;
  String? email;
  String? phone;
  String? username;
  String? password;
  String? role;
  String? status;
  String? image; // Thêm trường imageURL

  User({
    this.id,
    this.email,
    this.phone,
    this.username,
    this.password,
    this.role,
    this.status,
    this.image, // Thêm imageURL vào constructor
  });

  factory User.fromJson(Map<String, dynamic> json) => User(
    id: json["id"].toString(),
    email: json["email"],
    phone: json["phone"],
    username: json["username"],
    password: json["password"],
    role: json["role"],
    status: json["status"],
    image: json["image"], // Gán giá trị cho imageURL từ json
  );

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = {};
    data['id'] = id;
    data['email'] = email;
    data['phone'] = phone;
    data['username'] = username;
    data['password'] = password;
    data['role'] = role;
    data['status'] = status;
    data['image'] = image; // Thêm imageURL vào dữ liệu JSON
    return data;
  }

  static User userEmpty() {
    return User(
      id: '',
      email: '',
      phone: '',
      username: '',
      password: '',
      role: '',
      status: '',
      image: '', // Khởi tạo imageURL
    );
  }
}
