import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '/page/auth/login.dart';
import 'model/MyProvider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    await Firebase.initializeApp(
      options: FirebaseOptions(
        apiKey: "AIzaSyDkHzCkPWuuoPu9rZqIETiSvfm_W40U9iA",
        appId: "1:671019641222:android:8c4d869d90c25bd6572407",
        messagingSenderId: "671019641222",
        projectId: "portfolio-4352d",
      ),
    );
    print('Firebase initialized successfully');

    // Lấy dữ liệu từ Firestore
    final firestore = FirebaseFirestore.instance;
    final snapshot = await firestore.collection('groups').get();
    final groups = snapshot.docs.map((doc) => doc.data()).toList();

    print('Groups data: $groups');
  } catch (e) {
    print('Failed to initialize Firebase: $e');
  }
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({Key? key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => MyProvider()),
      ],
      child: const MaterialApp(
        debugShowCheckedModeBanner: false,
        home: LoginScreen(),
      ),
    );
  }
}
