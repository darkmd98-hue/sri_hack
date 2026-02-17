class MatchUser {
  MatchUser({
    required this.id,
    required this.name,
    required this.matchScore,
    required this.avgRating,
    required this.skills,
    this.dept,
    this.verificationStatus,
  });

  final int id;
  final String name;
  final int matchScore;
  final double avgRating;
  final List<String> skills;
  final String? dept;
  final String? verificationStatus;

  factory MatchUser.fromJson(Map<String, dynamic> json) {
    final rawSkills = (json['top_matching_skills'] as List<dynamic>? ?? const []);
    return MatchUser(
      id: _asInt(json['id']),
      name: (json['name'] ?? '') as String,
      matchScore: _asInt(json['match_score']),
      avgRating: (json['avg_rating'] is num) ? (json['avg_rating'] as num).toDouble() : 0.0,
      skills: rawSkills
          .map((dynamic item) => (item as Map<String, dynamic>)['name']?.toString() ?? '')
          .where((String value) => value.isNotEmpty)
          .toList(),
      dept: json['dept'] as String?,
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
