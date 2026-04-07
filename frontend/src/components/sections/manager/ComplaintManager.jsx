import React, { useState, useEffect } from "react";
import { 
  FaComments, 
  FaExclamationTriangle, 
  FaRegCommentDots, 
  FaClock, 
  FaSearch, 
  FaSync,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaPaperPlane,
  FaHistory
} from "react-icons/fa";
import { useAuth } from "../auth/AuthContext";
import AdminPagination from "../../common/AdminPagination";
import {
  getAllComplaints,
  getRepliesByComplaintId,
  createReply,
  updateComplaintById,
  getAllContracts,
} from "../../../services/adminService";
import { getAccounts, getResidents } from "../../../services/adminResidentService";
import { getApartments } from "../../../services/apartmentService";
import {
  paginateItems,
  formatAdminDateTime,
  formatAdminDate,
  getComplaintOwnerId,
  getReplyAuthorId,
  getComplaintTimestamp,
  getAdminTimestampValue,
} from "./utils";
import { canReplyComplaints, isStaffPortalRole } from "../../../admin/adminAccess";

const ComplaintManager = () => {
    const { user, role } = useAuth();
    const readOnly = isStaffPortalRole(role) && !canReplyComplaints(role);
    const [complaints, setComplaints] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedComplaintId, setSelectedComplaintId] = useState(null);
    const [replyDraft, setReplyDraft] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);
    const [feedback, setFeedback] = useState({ type: "", message: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
  
    const loadComplaintData = async ({ keepSelection = true } = {}) => {
      setIsLoading(true);
  
      try {
        const [complaintList, accountList, residentList, contractList, apartmentList] =
          await Promise.all([
            getAllComplaints(),
            getAccounts(),
            getResidents(),
            getAllContracts(),
            getApartments(),
          ]);
  
        const accountsMap = new Map(
          accountList.map((account) => [String(account.id), account]),
        );
        const residentsMap = new Map(
          residentList.map((resident) => [
            String(resident?.account?.id ?? resident?.accountId ?? resident?.id),
            resident,
          ]),
        );
        const apartmentMap = new Map(
          apartmentList.map((apartment) => [String(apartment.id), apartment]),
        );
        const contractsByAccount = contractList.reduce((map, contract) => {
          const accountId = contract?.account?.id ?? contract?.accountId;
          if (!accountId) return map;
  
          const key = String(accountId);
          const current = map.get(key) ?? [];
          current.push(contract);
          map.set(key, current);
          return map;
        }, new Map());
  
        const replyResults = await Promise.all(
          complaintList.map(async (complaint) => {
            try {
              const replies = await getRepliesByComplaintId(complaint?.id);
              return [complaint?.id, replies];
            } catch {
              return [complaint?.id, []];
            }
          }),
        );
  
        const repliesMap = new Map(replyResults);
  
        const normalizedComplaints = complaintList
          .map((complaint) => {
            const ownerId = getComplaintOwnerId(complaint);
            const ownerKey = ownerId !== null ? String(ownerId) : null;
            const account =
              (ownerKey ? accountsMap.get(ownerKey) : null) ??
              complaint?.madeByUser ??
              complaint?.user ??
              complaint?.account ??
              null;
            const resident =
              (ownerKey ? residentsMap.get(ownerKey) : null) ??
              complaint?.resident ??
              null;
            const contracts = ownerKey ? contractsByAccount.get(ownerKey) ?? [] : [];
            const sortedContracts = [...contracts].sort(
              (a, b) =>
                new Date(b?.startDate || 0).getTime() -
                new Date(a?.startDate || 0).getTime(),
            );
            const activeContract =
              sortedContracts.find((contract) => Number(contract?.status ?? 1) === 1) ??
              sortedContracts[0] ??
              null;
            const apartmentId =
              complaint?.apartment?.id ??
              complaint?.apartmentId ??
              activeContract?.apartment?.id ??
              activeContract?.apartmentId ??
              null;
            const apartment =
              (apartmentId !== null ? apartmentMap.get(String(apartmentId)) : null) ??
              complaint?.apartment ??
              activeContract?.apartment ??
              null;
            const replies = (repliesMap.get(complaint?.id) ?? []).map((reply) => ({
              ...reply,
              authorId: getReplyAuthorId(reply),
              authorName:
                reply?.user?.fullName ??
                reply?.user?.username ??
                reply?.createdBy?.fullName ??
                reply?.createdBy?.username ??
                "Staff/Admin",
              createdLabel: formatAdminDateTime(getComplaintTimestamp(reply)),
            }))
              .sort(
                (a, b) =>
                  getAdminTimestampValue(getComplaintTimestamp(a)) -
                  getAdminTimestampValue(getComplaintTimestamp(b)),
              );
            const createdAt = getComplaintTimestamp(complaint);
            const latestReplyAt =
              replies.length > 0
                ? getComplaintTimestamp(replies[replies.length - 1])
                : null;
            const lastActivityAt = latestReplyAt ?? createdAt;
            const status = replies.length > 0 ? "replied" : "new";
  
            return {
              ...complaint,
              ownerId,
              ownerName:
                resident?.fullName ??
                account?.fullName ??
                account?.username ??
                complaint?.fullName ??
                complaint?.residentName ??
                "Unknown resident",
              ownerEmail: account?.email ?? complaint?.email ?? "N/A",
              ownerPhone:
                resident?.phoneNumber ??
                account?.phoneNumber ??
                complaint?.phoneNumber ??
                "N/A",
              apartmentLabel:
                apartment?.roomNumber ??
                complaint?.roomNumber ??
                complaint?.apartmentNumber ??
                "Unassigned",
              floorNumber: apartment?.floorNumber ?? null,
              createdAt,
              createdLabel: formatAdminDateTime(createdAt),
              updatedLabel: formatAdminDateTime(
                complaint?.updatedAt ?? complaint?.modifiedAt,
              ),
              replies,
              replyCount: replies.length,
              latestReplyAt,
              latestReplyLabel:
                latestReplyAt !== null
                  ? formatAdminDateTime(latestReplyAt)
                  : "No replies yet",
              lastActivityAt,
              lastActivityLabel: formatAdminDateTime(lastActivityAt),
              status,
              statusLabel: status === "replied" ? "Replied" : "Pending review",
              sortPriority: status === "replied" ? 1 : 0,
              sortTimestamp: getAdminTimestampValue(lastActivityAt),
            };
          })
          .sort((a, b) => {
            if (a.sortPriority !== b.sortPriority) {
              return a.sortPriority - b.sortPriority;
            }
  
            return b.sortTimestamp - a.sortTimestamp;
          });
  
        setComplaints(normalizedComplaints);
        setFeedback({ type: "", message: "" });
  
        if (!keepSelection) {
          setSelectedComplaintId(normalizedComplaints[0]?.id ?? null);
          return;
        }
  
        setSelectedComplaintId((prev) => {
          if (prev && normalizedComplaints.some((complaint) => complaint.id === prev)) {
            return prev;
          }
          return normalizedComplaints[0]?.id ?? null;
        });
      } catch (error) {
        setFeedback({
          type: "error",
          message:
            error?.response?.data?.message ||
            "Could not load complaints from the backend.",
        });
        setComplaints([]);
        setSelectedComplaintId(null);
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      loadComplaintData({ keepSelection: false });
    }, []);
  
    useEffect(() => {
      setCurrentPage(1);
    }, [searchTerm, statusFilter, complaints.length]);
  
    useEffect(() => {
      setReplyDraft("");
    }, [selectedComplaintId]);
  
    const filteredComplaints = complaints
      .filter((complaint) => {
        const matchesStatus =
          statusFilter === "all" ? true : complaint.status === statusFilter;
        const keyword = searchTerm.trim().toLowerCase();
        const matchesSearch =
          keyword.length === 0
            ? true
            : [
              complaint.content,
              complaint.ownerName,
              complaint.ownerEmail,
              complaint.ownerPhone,
              complaint.apartmentLabel,
            ].some((value) =>
              String(value ?? "").toLowerCase().includes(keyword),
            );
  
        return matchesStatus && matchesSearch;
      });
  
    const paginatedComplaints = paginateItems(
      filteredComplaints,
      currentPage,
      pageSize,
    );
    const totalPages = Math.max(
      1,
      Math.ceil(filteredComplaints.length / pageSize),
    );
    const selectedComplaint =
      complaints.find((complaint) => complaint.id === selectedComplaintId) ?? null;
    const newCount = complaints.filter((complaint) => complaint.status === "new").length;
    const repliedCount = complaints.filter(
      (complaint) => complaint.status === "replied",
    ).length;
    const latestComplaintDate =
      complaints.length > 0 ? formatAdminDate(complaints[0].lastActivityAt) : "N/A";
  
    const handleSubmitReply = async () => {
      if (readOnly) {
        setFeedback({
          type: "error",
          message: "You do not have permission to reply to complaints.",
        });
        return;
      }

      if (!selectedComplaint || !replyDraft.trim()) {
        setFeedback({
          type: "error",
          message: "Please choose a complaint and enter a reply.",
        });
        return;
      }
  
      if (!user?.id) {
        setFeedback({
          type: "error",
          message:
            "Could not identify the current admin account for this reply. Please sign in again.",
        });
        return;
      }
  
      setIsSubmittingReply(true);
      setFeedback({ type: "", message: "" });
  
      try {
        await createReply({
          content: replyDraft.trim(),
          complaintId: selectedComplaint.id,
          userId: user.id,
        });
  
        try {
          await updateComplaintById(selectedComplaint.id, {
            content: selectedComplaint.content,
          });
        } catch {
          // Complaint status is inferred from replies
        }
  
        setReplyDraft("");
        await loadComplaintData();
        setFeedback({
          type: "success",
          message: "Reply sent and complaint data refreshed successfully.",
        });
      } catch (error) {
        setFeedback({
          type: "error",
          message:
            error?.response?.data?.message || "Failed to send reply.",
        });
      } finally {
        setIsSubmittingReply(false);
      }
    };
  
    return (
      <div className="admin-reports-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
        
        {/* COMPLAINT BANNER SECTION */}
        <header className="complaint-banner-container">
          <h2 className="role-banner-title">Complaint Command Center</h2>
          <p className="role-banner-desc">
            Track resident issues in real time, prioritize unanswered reports, and send responses directly from the admin workspace.
          </p>

          <div className="complaint-stats-grid">
            <div className="complaint-stat-glass-card">
              <div className="complaint-banner-icon" style={{ background: '#38bdf8' }}><FaComments /></div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginTop: '12px' }}>Total complaints</div>
              <div style={{ fontSize: "28px", fontWeight: "800", color: "#fff", marginTop: "4px" }}>{complaints.length}</div>
            </div>

            <div className="complaint-stat-glass-card">
              <div className="complaint-banner-icon" style={{ background: '#c98b3c' }}><FaExclamationTriangle /></div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginTop: '12px' }}>Pending review</div>
              <div style={{ fontSize: "28px", fontWeight: "800", color: "#fff", marginTop: "4px" }}>{newCount}</div>
            </div>

            <div className="complaint-stat-glass-card">
              <div className="complaint-banner-icon" style={{ background: '#22c55e' }}><FaRegCommentDots /></div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginTop: '12px' }}>Replied</div>
              <div style={{ fontSize: "28px", fontWeight: "800", color: "#fff", marginTop: "4px" }}>{repliedCount}</div>
            </div>

            <div className="complaint-stat-glass-card">
              <div className="complaint-banner-icon" style={{ background: '#c084fc' }}><FaClock /></div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginTop: '12px' }}>Latest activity</div>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "#fff", marginTop: "8px" }}>{latestComplaintDate}</div>
            </div>
          </div>
        </header>

        {feedback.message && (
          <div className={`admin-feedback ${feedback.type === "error" ? "error" : "success"}`} style={{ borderRadius: '15px' }}>
            {feedback.message}
          </div>
        )}

        {readOnly && (
          <div className="admin-feedback" style={{ borderRadius: '15px' }}>
            You do not have permission to reply to complaints. This screen is available in view-only mode.
          </div>
        )}

        {/* MAIN CONTENT AREA - SPLIT VIEW */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)', 
          gap: '25px',
          alignItems: 'start'
        }}>
          
          {/* LEFT: COMPLAINT QUEUE */}
          <section className="staff-form-container" style={{ margin: 0, padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Complaint Queue</h3>
                <p style={{ margin: '5px 0 0 0', color: 'var(--admin-text-muted)', fontSize: '13px' }}>
                  Filter and track all incoming resident reports
                </p>
              </div>
              <button className="btn-action-dark" onClick={() => loadComplaintData()} disabled={isLoading}>
                <FaSync style={{ marginRight: '8px' }} /> Refresh
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: '15px', marginBottom: '25px' }}>
              <div className="role-search-wrapper" style={{ margin: 0 }}>
                <FaSearch className="role-search-icon" />
                <input 
                  type="text" 
                  className="role-search-input"
                  placeholder="Search by resident, room, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select 
                className="role-search-input" 
                style={{ padding: '0 15px', color: 'var(--admin-text-main)' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All statuses</option>
                <option value="new">Pending</option>
                <option value="replied">Replied</option>
              </select>
            </div>

            <div className="complaint-list-queue">
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '50px', color: 'var(--admin-text-muted)' }}>Loading reports...</div>
              ) : filteredComplaints.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px', color: 'var(--admin-text-muted)' }}>No complaints found.</div>
              ) : (
                paginatedComplaints.map(complaint => (
                  <div 
                    key={complaint.id} 
                    className={`complaint-item-card ${selectedComplaintId === complaint.id ? 'selected' : ''}`}
                    onClick={() => setSelectedComplaintId(complaint.id)}
                    style={{ borderLeft: selectedComplaintId === complaint.id ? '4px solid var(--admin-primary)' : '1px solid var(--admin-border-soft)' }}
                  >
                    {/* Header: Name, Email, Status, Time */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <strong style={{ fontSize: '16px', color: '#0f172a' }}>{complaint.ownerName}</strong>
                          <span 
                            className="status-badge" 
                            style={{ 
                              fontSize: '9px', 
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              background: complaint.status === "new" ? '#fee2e2' : '#f0f9ff',
                              color: complaint.status === "new" ? '#ef4444' : '#0369a1',
                              padding: '2px 8px',
                              borderRadius: '999px'
                            }}
                          >
                            {complaint.statusLabel}
                          </span>
                        </div>
                        <div style={{ color: '#64748b', fontSize: '11px', marginTop: '3px' }}>{complaint.ownerEmail}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                          <div style={{ color: '#94a3b8', fontSize: '10px', textTransform: 'uppercase', marginBottom: '1px' }}>Submitted</div>
                          <div style={{ color: '#64748b', fontSize: '11px', fontWeight: 800 }}>{complaint.createdLabel}</div>
                      </div>
                    </div>

                    {/* Info Grid: Room, Replies, Phone */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)', 
                      gap: '10px', 
                      marginBottom: '15px',
                      background: '#f8fafc',
                      padding: '12px 15px',
                      borderRadius: '15px'
                    }}>
                      <div>
                        <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '2px' }}>Apartment</div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>Room {complaint.apartmentLabel}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '2px' }}>Replies</div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{complaint.replyCount} replies</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '2px' }}>Phone</div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{complaint.ownerPhone}</div>
                      </div>
                    </div>

                    {/* Message Snippet */}
                    <p style={{ 
                      margin: 0, 
                      fontSize: '13px', 
                      color: '#334155',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.6
                    }}>
                      {complaint.content}
                    </p>
                  </div>
                ))
              )}
            </div>

            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredComplaints.length}
              pageSize={pageSize}
              itemLabel="complaints"
            />
          </section>

          {/* RIGHT: DETAIL VIEW */}
          <section className="complaint-detail-view" style={{ minHeight: 'auto' }}>
            {!selectedComplaint ? (
              <div style={{ display: 'grid', placeItems: 'center', height: '100%', textAlign: 'center', color: 'var(--admin-text-muted)', padding: '40px' }}>
                <FaRegCommentDots style={{ fontSize: '3rem', marginBottom: '15px', opacity: 0.3 }} />
                <p>{readOnly ? "Select a complaint from the queue to view details." : "Select a complaint from the queue to view details and send responses."}</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
                  <div>
                    <div style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      background: 'var(--admin-primary-light)', 
                      color: 'var(--admin-primary)', 
                      padding: '6px 12px', 
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 800,
                      marginBottom: '15px'
                    }}>
                      <FaComments /> Ticket #{selectedComplaint.id}
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{selectedComplaint.ownerName}</h3>
                    <p style={{ margin: '6px 0 0 0', color: 'var(--admin-text-muted)', fontSize: '14px' }}>
                      Room {selectedComplaint.apartmentLabel} | {selectedComplaint.ownerPhone}
                    </p>
                  </div>
                  <span className={`status-badge ${selectedComplaint.status === "replied" ? "badge-view" : "badge-update"}`} style={{ padding: '8px 15px', borderRadius: '12px' }}>
                    {selectedComplaint.statusLabel}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '25px' }}>
                  <div style={{ padding: '15px', background: 'var(--admin-bg-primary)', borderRadius: '15px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Submitted</div>
                    <div style={{ fontWeight: 700, fontSize: '13px' }}>{selectedComplaint.createdLabel}</div>
                  </div>
                  <div style={{ padding: '15px', background: 'var(--admin-bg-primary)', borderRadius: '15px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Awaiting reply</div>
                    <div style={{ fontWeight: 700, fontSize: '13px' }}>{selectedComplaint.status === "new" ? "Not replied yet" : selectedComplaint.latestReplyLabel}</div>
                  </div>
                  <div style={{ padding: '15px', background: 'var(--admin-bg-primary)', borderRadius: '15px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Email Address</div>
                    <div style={{ fontWeight: 700, fontSize: '13px', wordBreak: 'break-all' }}>{selectedComplaint.ownerEmail}</div>
                  </div>
                  <div style={{ padding: '15px', background: 'var(--admin-bg-primary)', borderRadius: '15px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>History</div>
                    <div style={{ fontWeight: 700, fontSize: '13px' }}>{selectedComplaint.replyCount} interactions</div>
                  </div>
                </div>

                <div className="resident-msg-box">
                  <div className="resident-msg-header">RESIDENT MESSAGE</div>
                  <div className="resident-msg-content">{selectedComplaint.content}</div>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <h4 style={{ margin: 0, fontWeight: 800 }}>Reply history</h4>
                    <FaHistory style={{ color: 'var(--admin-text-light)' }} />
                  </div>
                  
                  <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '5px' }}>
                    {selectedComplaint.replies.length === 0 ? (
                      <div style={{ padding: '15px', border: '2px dashed var(--admin-border-soft)', borderRadius: '15px', textAlign: 'center', color: 'var(--admin-text-muted)', fontSize: '13px' }}>
                        {readOnly ? "No conversation history yet." : "No conversation history yet. Send a response below."}
                      </div>
                    ) : (
                      selectedComplaint.replies.map(reply => (
                        <div key={reply.id} style={{ padding: '12px 15px', background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '4px solid var(--admin-primary)', borderRadius: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <strong style={{ fontSize: '13px' }}>{reply.authorName}</strong>
                            <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>{reply.createdLabel}</span>
                          </div>
                          <div style={{ fontSize: '13px', lineHeight: 1.5 }}>{reply.content}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {!readOnly ? (
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Compose Response</label>
                    <textarea 
                      style={{ 
                        minHeight: '100px', 
                        borderRadius: '15px', 
                        resize: 'none', 
                        padding: '15px',
                        background: '#fff',
                        border: '1px solid var(--admin-border-soft)',
                        fontSize: '14px'
                      }}
                      placeholder="Type your reply to the resident here..."
                      value={replyDraft}
                      onChange={(e) => setReplyDraft(e.target.value)}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
                      <button 
                        className="btn-submit" 
                        style={{ width: '180px', borderRadius: '12px' }}
                        onClick={handleSubmitReply}
                        disabled={isSubmittingReply || !replyDraft.trim()}
                      >
                        <FaPaperPlane style={{ marginRight: '8px' }} /> {isSubmittingReply ? "Sending..." : "Send Reply"}
                      </button>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </section>
        </div>
      </div>
    );
};

export default ComplaintManager;
