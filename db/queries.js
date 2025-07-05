const pool = require("./pool");

async function getAllMessages() {
  const { rows } = await pool.query(
    "SELECT messages.id as message_id, messages.message as message, messages.time as time, users.id as user_id, users.username as user_name, users.first_name as first_name, users.last_name as last_name, users.member_status as member_status, users.admin as admin_status FROM messages JOIN users ON messages.user_id = users.id"
  );
  return rows;
}

async function addMessage(userid, message, date) {
  await pool.query(
    "INSERT INTO messages (message, time, user_id) VALUES ($1,$2,$3)",
    [message, date, userid]
  );
}

async function addUser(username, password, first_name, last_name, admin) {
  await pool.query(
    "INSERT INTO users (username, password, first_name, last_name, member_status, admin) VALUES ($1,$2,$3,$4,$5,$6)",
    [username, password, first_name, last_name, false, admin]
  );
}

async function upgradeToMember(userid) {
  await pool.query("UPDATE users SET member_status = true WHERE id = $1", [
    userid,
  ]);
}

async function removeMemberStatus(userid) {
  await pool.query("UPDATE users SET member_status = false WHERE id = $1", [
    userid,
  ]);
}

async function upgradeToAdmin(userid) {
  await pool.query("UPDATE users SET admin = true WHERE id = $1", [userid]);
}

async function removeAdminStatus(userid) {
  await pool.query("UPDATE users SET admin = false WHERE id = $1", [userid]);
}

async function deleteMessage(messageid) {
  await pool.query("DELETE FROM messages WHERE id = $1", [messageid]);
}

module.exports = {
  getAllMessages,
  addMessage,
  addUser,
  deleteMessage,
  upgradeToMember,
  removeMemberStatus,
  upgradeToAdmin,
  removeAdminStatus,
};
