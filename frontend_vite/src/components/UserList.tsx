// src/components/UserList.tsx
import React from 'react';

const UserList: React.FC<{ users: { id: string }[] }> = ({ users }) => {
  return (
    <div>
      <h3>Users in Room:</h3>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.id}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
