class User {
  User({
    required this.id,
    required this.name,
    required this.email,
    this.role,
    this.dept,
    this.year,
    this.bio,
    this.avatarUrl,
    this.verificationStatus,
  });

  final int id;
  final String name;
  final String email;
  final String? role;
  final String? dept;
  final int? year;
  final String? bio;
  final String? avatarUrl;
  final String? verificationStatus;

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: _asInt(json['id']),
      name: (json['name'] ?? '') as String,
      email: (json['email'] ?? '') as String,
      role: json['role'] as String?,
      dept: json['dept'] as String?,
      year: _asNullableInt(json['year']),
      bio: json['bio'] as String?,
      avatarUrl: json['avatar_url'] as String?,
      verificationStatus: json['verification_status'] as String?,
    );
  }
}

int _asInt(dynamic value) {
  if (value is int) {
    return value;
  }
  return int.tryParse('$value') ?? 0;
}

int? _asNullableInt(dynamic value) {
  if (value == null) {
    return null;
  }
  if (value is int) {
    return value;
  }
  return int.tryParse('$value');
}
