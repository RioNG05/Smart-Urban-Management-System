import React from 'react';
import { FaReply, FaCheck, FaTimes, FaPaperPlane, FaClock } from 'react-icons/fa';

const ComplaintsSection = ({
    selectedComplaint,
    complaints,
    setSelectedComplaint,
    handleAction,
    replyNote,
    setReplyNote
}) => {
    return (
        <div className="staff-complaint-section staff-tab-content">
            {!selectedComplaint ? (
                <div className="staff-form-container">
                    <h3>Resident Complaints List</h3>
                    <div className="staff-table-scroll">
                        <table className="admin-custom-table bordered" style={{ marginTop: '20px' }}>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Time</th>
                                    <th>Resident Name</th>
                                    <th>Apartment</th>
                                    <th>Complaint Content</th>
                                    <th style={{ textAlign: 'center' }}>Replied By</th>
                                    <th style={{ textAlign: 'center' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {complaints.map((c, idx) => (
                                    <tr key={c.id}>
                                        <td>{idx + 1}</td>
                                        <td style={{ fontSize: '12px', color: '#64748b' }}><FaClock style={{ marginRight: '5px' }} />{c.time}</td>
                                        <td><strong>{c.name}</strong></td>
                                        <td>{c.room}</td>
                                        <td>{c.note}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            {c.repliedBy ? (
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '11px',
                                                    fontWeight: 'bold',
                                                    background: '#dcfce7',
                                                    color: '#10b981'
                                                }}>
                                                    {c.repliedBy}
                                                </span>
                                            ) : (
                                                <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>Waiting...</span>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <button
                                                    className="btn-reply-main"
                                                    disabled={!!c.repliedBy}
                                                    onClick={() => setSelectedComplaint(c)}
                                                    style={{
                                                        opacity: c.repliedBy ? 0.5 : 1,
                                                        cursor: c.repliedBy ? 'not-allowed' : 'pointer',
                                                        filter: c.repliedBy ? 'grayscale(1)' : 'none'
                                                    }}
                                                >
                                                    <FaReply /> {c.repliedBy ? 'Replied' : 'Reply'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                </div>
            ) : (
                <div className="staff-reply-detail-page">
                    <button onClick={() => setSelectedComplaint(null)} style={{ marginBottom: '15px', cursor: 'pointer', border: '1px solid #ddd', background: '#fff', padding: '5px 15px', borderRadius: '5px' }}>← Back</button>
                    <div className="staff-form-container" style={{ borderTop: '5px solid #c89b3c' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h3>Response to: {selectedComplaint.name} ({selectedComplaint.room})</h3>
                            <span style={{ fontSize: '13px', color: '#64748b' }}><FaClock /> Sent at: {selectedComplaint.time}</span>
                        </div>
                        <div style={{ background: '#f1f5f9', padding: '15px', borderRadius: '8px', fontStyle: 'italic', marginBottom: '20px', borderLeft: '4px solid #cbd5e0' }}>
                            "{selectedComplaint.note}"
                        </div>
                        <label><strong>RESPONSE NOTE:</strong></label>
                        <textarea
                            style={{ width: '100%', height: '120px', marginTop: '10px', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontFamily: 'inherit' }}
                            placeholder="Enter response to resident..."
                            value={replyNote}
                            onChange={(e) => setReplyNote(e.target.value)}
                        ></textarea>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
                            <button className="btn-add-resident" onClick={() => {
                                if (!replyNote.trim()) {
                                    alert("Please enter a response note!");
                                    return;
                                }
                                handleAction(selectedComplaint.id, 'Replied', replyNote);
                                setSelectedComplaint(null);
                                setReplyNote("");
                            }}>
                                <FaPaperPlane /> SEND REPLY
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default ComplaintsSection;
