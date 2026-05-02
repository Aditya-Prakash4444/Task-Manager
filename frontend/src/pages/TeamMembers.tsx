import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import './TeamMembers.css';

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const TeamMembers = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchTeamMembers = async () => {
      try {
        const response = await api.get('/auth/team-members');
        if (isMounted) {
          setMembers(response.data);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTeamMembers();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <h2 className="team-loading">Loading team members...</h2>;

  return (
    <div className="team-members-container">
      <h1 className="team-members-title">Team Members</h1>
      
      <div className="members-grid">
        {members.length === 0 ? (
          <p className="no-members-message">No team members found.</p>
        ) : (
          members.map((member) => (
            <div key={member._id} className="member-card">
              <div className="member-avatar">
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div className="member-info">
                <h3 className="member-name">{member.name}</h3>
                <p className="member-email">{member.email}</p>
                <span className={`member-role role-${member.role.toLowerCase()}`}>
                  {member.role}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeamMembers;
