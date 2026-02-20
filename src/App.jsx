
import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  FaHome, FaBoxOpen, FaClipboardList, FaFileInvoiceDollar, FaUsers, FaChartLine, FaCog, FaHistory,
  FaSearch, FaUserCircle, FaBars, FaTimes, FaPlus, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle,
  FaInfoCircle, FaExclamationTriangle, FaDownload, FaFilter, FaArrowLeft, FaFileAlt, FaFileUpload,
  FaDollarSign, FaPercent, FaClock, FaCalendarAlt, FaShieldAlt, FaLightbulb, FaExchangeAlt, FaHourglassHalf,
  FaHammer, FaTasks, FaClipboardCheck, FaAward
} from 'react-icons/fa';

// Context for Auth and Navigation (RBAC is handled via canAccess function and userRoles object)
const AuthContext = createContext(null);
const NavigationContext = createContext(null);
const NotificationContext = createContext(null);

// Utility for unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// --- DUMMY DATA ---
const users = [
  { id: 'user_1', username: 'business.user', role: 'Business User', name: 'Alice Johnson' },
  { id: 'user_2', username: 'procurement.officer', role: 'Procurement Officer', name: 'Bob Williams' },
  { id: 'user_3', username: 'supplier.alpha', role: 'Supplier', name: 'Supplier Alpha Inc.' },
  { id: 'user_4', username: 'supplier.beta', role: 'Supplier', name: 'Supplier Beta Co.' },
];

const STATUS_COLORS = {
  'Approved': 'status-green',
  'Completed': 'status-green',
  'Closed': 'status-green',
  'In Progress': 'status-blue',
  'Assigned': 'status-blue',
  'Open': 'status-blue',
  'Acknowledged': 'status-blue',
  'Pending': 'status-orange',
  'Pending Approval': 'status-orange',
  'Action Required': 'status-orange',
  'Quotes Received': 'status-orange',
  'Pending Review': 'status-orange',
  'Rejected': 'status-red',
  'SLA Breach': 'status-red',
  'Blocked': 'status-red',
  'Canceled': 'status-red',
  'Exception': 'status-purple',
  'Escalation': 'status-purple',
  'Draft': 'status-grey',
  'Archived': 'status-grey',
  'New': 'status-grey',
  'Awarded': 'status-yellow',
  'Partially Fulfilled': 'status-blue',
  'Fulfilled': 'status-green',
  'Sent to Supplier': 'status-blue',
  'Evaluation': 'status-orange',
};

const getStatusColorClass = (status) => STATUS_COLORS[status] || 'status-grey';

const generateRFQs = (count = 10) => {
  const rfqData = [];
  const initiators = users.filter(u => u.role === 'Business User');
  const allSuppliers = users.filter(u => u.role === 'Supplier');
  const statuses = ['Draft', 'Open', 'Quotes Received', 'Pending Approval', 'Awarded', 'Rejected', 'Closed', 'SLA Breach'];
  const categories = ['IT Services', 'Office Supplies', 'Marketing', 'Facility Maint.', 'Travel'];

  for (let i = 0; i < count; i++) {
    const initiator = initiators[Math.floor(Math.random() * initiators.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const numSuppliers = Math.floor(Math.random() * 3) + 1;
    const assignedSuppliers = allSuppliers.sort(() => 0.5 - Math.random()).slice(0, numSuppliers).map(s => s.id);
    const hasQuotes = status === 'Quotes Received' || status === 'Awarded' || status === 'Rejected' || status === 'Closed';
    const numQuotes = hasQuotes ? Math.floor(Math.random() * numSuppliers) + 1 : 0;

    rfqData.push({
      id: `RFQ-${1000 + i}`,
      title: `RFQ for ${categories[Math.floor(Math.random() * categories.length)]} - ${i + 1}`,
      description: `Detailed request for quotation for ${categories[Math.floor(Math.random() * categories.length)]}. This procurement aims to acquire necessary goods/services efficiently.`,
      category: categories[Math.floor(Math.random() * categories.length)],
      initiatorId: initiator.id,
      initiatorName: initiator.name,
      status: status,
      budget: Math.floor(Math.random() * 9000) + 1000,
      creationDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dueDate: new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignedSuppliers: assignedSuppliers,
      attachments: [{ name: `specs-${i}.pdf`, url: '#', type: 'application/pdf' }],
      workflowHistory: [
        { stage: 'Draft', by: initiator.name, date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        status !== 'Draft' && { stage: 'Open', by: 'System', date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        hasQuotes && { stage: 'Quotes Received', by: 'System', date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        status === 'Pending Approval' && { stage: 'Pending Approval', by: 'Procurement Officer', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        status === 'Awarded' && { stage: 'Awarded', by: 'Procurement Officer', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        status === 'Rejected' && { stage: 'Rejected', by: 'Procurement Officer', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        status === 'SLA Breach' && { stage: 'SLA Breach', by: 'System', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
      ].filter(Boolean),
      quotes: Array.from({ length: numQuotes }).map((_, qi) => ({
        id: `Q-${generateId()}`,
        supplierId: assignedSuppliers[qi],
        supplierName: allSuppliers.find(s => s.id === assignedSuppliers[qi])?.name || `Supplier ${qi}`,
        amount: Math.floor(Math.random() * (rfqData[i].budget * 1.1 - rfqData[i].budget * 0.8 + 1)) + rfqData[i].budget * 0.8,
        submissionDate: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: status === 'Awarded' && qi === 0 ? 'Awarded' : 'Submitted',
        terms: 'Net 30',
        quoteAttachments: [{ name: `quote-${qi}.pdf`, url: '#', type: 'application/pdf' }]
      }))
    });
  }
  return rfqData;
};

const generatePOs = (rfqs, count = 10) => {
  const poData = [];
  const procurementOfficers = users.filter(u => u.role === 'Procurement Officer');
  const statuses = ['Draft', 'Pending Approval', 'Approved', 'Sent to Supplier', 'Acknowledged', 'Partially Fulfilled', 'Fulfilled', 'Closed'];

  // Ensure some POs are linked to 'Awarded' RFQs
  const awardedRfqs = rfqs.filter(r => r.status === 'Awarded');
  const usedRfqIds = new Set();

  for (let i = 0; i < count; i++) {
    const officer = procurementOfficers[Math.floor(Math.random() * procurementOfficers.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    let rfq = awardedRfqs.find(r => !usedRfqIds.has(r.id)) || rfqs[Math.floor(Math.random() * rfqs.length)]; // Link to an awarded RFQ first
    if (rfq) usedRfqIds.add(rfq.id);

    const supplierId = rfq ? rfq.quotes.find(q => q.status === 'Awarded')?.supplierId || rfq.assignedSuppliers[0] : users.find(u => u.role === 'Supplier')?.id;
    const supplierName = users.find(u => u.id === supplierId)?.name || 'N/A';
    const amount = rfq ? rfq.quotes.find(q => q.status === 'Awarded')?.amount || rfq.budget : Math.floor(Math.random() * 10000) + 2000;

    poData.push({
      id: `PO-${2000 + i}`,
      rfqId: rfq?.id || null,
      title: `Purchase Order for ${rfq?.category || 'General Procurement'} - ${i + 1}`,
      description: `PO for items related to ${rfq?.category || 'general items'}.`,
      initiatorId: officer.id,
      initiatorName: officer.name,
      supplierId: supplierId,
      supplierName: supplierName,
      amount: amount,
      status: status,
      orderDate: new Date(Date.now() - Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      deliveryDate: new Date(Date.now() + Math.floor(Math.random() * 40) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      paymentTerms: 'Net 30',
      attachments: [{ name: `po-contract-${i}.pdf`, url: '#', type: 'application/pdf' }],
      workflowHistory: [
        { stage: 'Draft', by: officer.name, date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        status !== 'Draft' && { stage: 'Pending Approval', by: officer.name, date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        (status === 'Approved' || status === 'Sent to Supplier' || status === 'Acknowledged' || status === 'Partially Fulfilled' || status === 'Fulfilled' || status === 'Closed') && { stage: 'Approved', by: 'Finance Officer', date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        (status === 'Sent to Supplier' || status === 'Acknowledged' || status === 'Partially Fulfilled' || status === 'Fulfilled' || status === 'Closed') && { stage: 'Sent to Supplier', by: 'System', date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        (status === 'Acknowledged' || status === 'Partially Fulfilled' || status === 'Fulfilled' || status === 'Closed') && { stage: 'Acknowledged', by: supplierName, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        (status === 'Partially Fulfilled' || status === 'Fulfilled' || status === 'Closed') && { stage: 'Partially Fulfilled', by: 'Warehouse', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        (status === 'Fulfilled' || status === 'Closed') && { stage: 'Fulfilled', by: 'Warehouse', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        status === 'Closed' && { stage: 'Closed', by: 'Procurement Officer', date: new Date().toISOString().split('T')[0] }
      ].filter(Boolean)
    });
  }
  return poData;
};

const generateSuppliers = (count = 5) => {
  const supplierData = [];
  const statuses = ['New', 'Pending Review', 'Approved', 'Rejected'];
  const supplierUsers = users.filter(u => u.role === 'Supplier');

  for (let i = 0; i < count; i++) {
    const user = supplierUsers[i] || { id: generateId(), name: `Generic Supplier ${i + 1}` };
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    supplierData.push({
      id: user.id,
      name: user.name,
      contactPerson: `Contact ${user.name.split(' ')[0]}`,
      email: `${user.name.toLowerCase().replace(/ /g, '.')}@example.com`,
      phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      status: status,
      onboardingDate: new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      documents: [{ name: `vendor-agreement-${i}.pdf`, url: '#', type: 'application/pdf' }],
      category: ['IT', 'Logistics', 'Consulting', 'Manufacturing'][Math.floor(Math.random() * 4)],
      address: `${Math.floor(Math.random() * 1000) + 1} Main St, City, State`
    });
  }
  return supplierData;
};

const generateAuditLogs = (rfqs, pos, suppliers, count = 20) => {
  const logData = [];
  const allEntities = [...rfqs, ...pos, ...suppliers];
  const actions = ['Created', 'Updated', 'Approved', 'Rejected', 'Assigned', 'Responded', 'Viewed'];
  const subjects = users.map(u => u.name);

  for (let i = 0; i < count; i++) {
    const entity = allEntities[Math.floor(Math.random() * allEntities.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const subject = subjects[Math.floor(Math.random() * subjects.length)];

    logData.push({
      id: generateId(),
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000 - Math.floor(Math.random() * 3600) * 1000).toISOString(),
      actor: subject,
      action: action,
      entityType: entity?.id.startsWith('RFQ') ? 'RFQ' : entity?.id.startsWith('PO') ? 'Purchase Order' : 'Supplier',
      entityId: entity?.id || 'N/A',
      details: `${subject} ${action.toLowerCase()} ${entity?.id || 'N/A'}`
    });
  }
  return logData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};


let dummyRFQs = generateRFQs(15);
let dummyPOs = generatePOs(dummyRFQs, 12);
let dummySuppliers = generateSuppliers(5); // Adjust this to match supplier users initially.
dummySuppliers = dummySuppliers.map(s => ({ ...s,
  id: users.find(u => u.name === s.name)?.id || s.id // Ensure dummy supplier IDs match user IDs if they exist
}));

let dummyAuditLogs = generateAuditLogs(dummyRFQs, dummyPOs, dummySuppliers, 30);

// --- RBAC Configuration ---
const userRoles = {
  'Business User': {
    canView: ['Dashboard', 'RFQsList', 'RFQDetail', 'RFQForm', 'RFQsInitiated', 'WorkflowTracker'],
    canAction: ['CreateRFQ', 'EditMyRFQ', 'CancelMyRFQ'],
    canAccessData: {
      rfq: {
        view: (rfq, user) => rfq.initiatorId === user.id || ['Approved', 'Awarded', 'Closed'].includes(rfq.status), // Can view own or approved/awarded RFQs
        edit: (rfq, user) => rfq.initiatorId === user.id && ['Draft', 'Open'].includes(rfq.status) // Can edit own draft/open RFQs
      },
      po: { view: (po, user) => po.rfqId && dummyRFQs.find(r => r.id === po.rfqId)?.initiatorId === user.id }, // Can view POs linked to their RFQs
      supplier: { view: (supplier, user) => false }, // No direct supplier view for business user
      auditLog: { view: (log, user) => log.actor === user.name } // Can view their own actions
    }
  },
  'Procurement Officer': {
    canView: ['Dashboard', 'RFQsList', 'RFQDetail', 'RFQForm', 'PurchaseOrdersList', 'PurchaseOrderDetail', 'POForm', 'SupplierOnboardingList', 'SupplierOnboardingDetail', 'AuditLogsScreen', 'WorkflowTracker'],
    canAction: ['ApproveRFQ', 'RejectRFQ', 'CreatePO', 'EditPO', 'ManageSuppliers', 'ExportData', 'CreateRFQ'],
    canAccessData: {
      rfq: {
        view: (rfq, user) => true, // Can view all RFQs
        edit: (rfq, user) => ['Open', 'Quotes Received', 'Pending Approval'].includes(rfq.status) // Can edit certain stages
      },
      po: {
        view: (po, user) => true, // Can view all POs
        edit: (po, user) => ['Draft', 'Pending Approval', 'Sent to Supplier'].includes(po.status) // Can edit certain stages
      },
      supplier: {
        view: (supplier, user) => true, // Can view all suppliers
        edit: (supplier, user) => ['New', 'Pending Review'].includes(supplier.status) // Can edit new/pending suppliers
      },
      auditLog: { view: (log, user) => true } // Can view all audit logs
    }
  },
  'Supplier': {
    canView: ['Dashboard', 'RFQsList', 'RFQDetail', 'SupplierResponseForm', 'MyQuotes', 'WorkflowTracker', 'SupplierOnboardingDetail'], // Supplier onboarding detail is their own profile
    canAction: ['RespondToRFQ', 'UploadDocuments', 'ManageCatalog', 'SubmitQuote'],
    canAccessData: {
      rfq: {
        view: (rfq, user) => rfq.assignedSuppliers.includes(user.id) || rfq.quotes.some(q => q.supplierId === user.id), // Can view RFQs assigned to them or if they've quoted
        respond: (rfq, user) => rfq.assignedSuppliers.includes(user.id) && rfq.status === 'Open'
      },
      po: { view: (po, user) => po.supplierId === user.id }, // Can view POs issued to them
      supplier: {
        view: (supplier, user) => supplier.id === user.id, // Can only view their own supplier profile
        edit: (supplier, user) => supplier.id === user.id && ['New', 'Pending Review'].includes(supplier.status) // Can edit their own profile if new/pending
      },
      auditLog: { view: (log, user) => log.actor === user.name } // Can view their own actions
    }
  }
};


// --- AuthProvider Component ---
const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const login = (username) => {
    const user = users.find(u => u.username === username);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const canAccess = (feature, item, actionType = 'view') => {
    if (!currentUser) return false;
    const rolePermissions = userRoles[currentUser.role];

    if (!rolePermissions) return false;

    // Check for general feature access (e.g., screen names)
    if (typeof item === 'string') {
      return rolePermissions.canView && rolePermissions.canView.includes(item);
    }

    // Check for data-level access
    if (item && rolePermissions.canAccessData && rolePermissions.canAccessData[feature]) {
      const dataPermissionFunc = rolePermissions.canAccessData[feature][actionType];
      return dataPermissionFunc ? dataPermissionFunc(item, currentUser) : false;
    }

    // Check for specific action access (e.g., 'CreateRFQ')
    if (typeof item === 'string' && actionType === 'action') {
        return rolePermissions.canAction && rolePermissions.canAction.includes(item);
    }

    return false;
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, canAccess }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- NavigationProvider Component ---
const NavigationProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('Dashboard');
  const [screenHistory, setScreenHistory] = useState(['Dashboard']);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (!currentUser) {
      setCurrentScreen('Login');
      setScreenHistory(['Login']);
    } else if (screenHistory.length === 1 && screenHistory[0] === 'Login') {
      // If logging in from login screen, navigate to dashboard
      setCurrentScreen('Dashboard');
      setScreenHistory(['Dashboard']);
    } else if (!userRoles[currentUser.role]?.canView.includes(currentScreen)) {
        // If current screen is not accessible for the new role, redirect to Dashboard
        setCurrentScreen('Dashboard');
        setScreenHistory(['Dashboard']);
    }
  }, [currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  const navigate = (screenName, data = null) => {
    setScreenHistory(prev => {
      const newHistory = [...prev, { name: screenName, data }];
      return newHistory;
    });
    setCurrentScreen({ name: screenName, data });
  };

  const goBack = () => {
    setScreenHistory(prev => {
      if (prev.length > 1) {
        const newHistory = prev.slice(0, -1);
        setCurrentScreen(newHistory[newHistory.length - 1]);
        return newHistory;
      }
      return prev;
    });
  };

  const resetToDashboard = () => {
    setCurrentScreen('Dashboard');
    setScreenHistory(['Dashboard']);
  };

  return (
    <NavigationContext.Provider value={{ currentScreen, navigate, goBack, screenHistory, resetToDashboard }}>
      {children}
    </NavigationContext.Provider>
  );
};

// --- NotificationProvider Component ---
const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info', title = 'Notification') => {
    const id = generateId();
    setNotifications(prev => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000); // Auto-dismiss after 5 seconds
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div className="notification-container">
        {notifications.map(note => (
          <NotificationToast key={note.id} {...note} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};


// --- Reusable Components ---
const NotificationToast = ({ title, message, type }) => {
  const icon = {
    info: <FaInfoCircle style={{ color: 'var(--status-blue)' }} />,
    success: <FaCheckCircle style={{ color: 'var(--status-green)' }} />,
    error: <FaTimesCircle style={{ color: 'var(--status-red)' }} />,
    warning: <FaExclamationTriangle style={{ color: 'var(--status-orange)' }} />,
  }[type] || <FaInfoCircle style={{ color: 'var(--status-blue)' }} />;

  return (
    <div className={`notification-toast ${type}`}>
      <div className="notification-icon">{icon}</div>
      <div className="notification-content">
        <h4>{title}</h4>
        <p>{message}</p>
      </div>
    </div>
  );
};

const CardComponent = ({ title, status, details, onClick, footerActions, className = '', type = 'default' }) => {
  const statusClass = getStatusColorClass(status);
  return (
    <div className={`card ${statusClass} ${className}`} onClick={onClick}>
      <div className="card-header">
        {title}
        <span className="card-header-status">{status}</span>
      </div>
      <div className="card-body">
        {Object.entries(details).map(([key, value]) => (
          <p key={key}><strong>{key}:</strong> {value}</p>
        ))}
      </div>
      {footerActions && (
        <div className="card-footer">
          <div className="actions">
            {footerActions.map((action, index) => (
              <button key={index} className="btn btn-text" onClick={(e) => { e.stopPropagation(); action.handler(); }}>
                {action.icon} {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const WorkflowTracker = ({ workflowHistory, currentStatus, stagesConfig }) => {
    const currentStageIndex = stagesConfig.findIndex(s => s.status === currentStatus);

    return (
        <div className="workflow-tracker">
            {stagesConfig.map((stage, index) => {
                const isCompleted = index < currentStageIndex;
                const isActive = index === currentStageIndex;
                const isPending = index > currentStageIndex;

                const stageClassName = `workflow-stage ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''} ${isPending ? 'pending' : ''}`;
                const connectorClassName = `workflow-connector ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`;

                return (
                    <React.Fragment key={stage.status}>
                        <div className={stageClassName}>
                            <div className="workflow-stage-icon">
                                {isCompleted ? <FaCheckCircle /> : stage.icon}
                            </div>
                            <span className="workflow-stage-title">{stage.label}</span>
                            {/* SLA or Date if available */}
                            {workflowHistory.find(h => h.stage === stage.status) && (
                                <span style={{ fontSize: '0.8em', color: 'var(--text-light)' }}>
                                    {workflowHistory.find(h => h.stage === stage.status)?.date}
                                </span>
                            )}
                        </div>
                        {index < stagesConfig.length - 1 && (
                            <div className={connectorClassName}></div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};


// --- Page Components ---

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const { navigate } = useContext(NavigationContext);
  const { addNotification } = useContext(NotificationContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const success = login(username);
    if (success) {
      addNotification(`Welcome, ${username}!`, 'success', 'Login Successful');
      navigate('Dashboard');
    } else {
      setError('Invalid username. Please try again.');
      addNotification('Invalid username. Please try again.', 'error', 'Login Failed');
    }
  };

  return (
    <div className="full-screen-page flex justify-center items-center" style={{ backgroundColor: 'var(--primary-light)' }}>
      <div className="form-container" style={{ maxWidth: '400px' }}>
        <h2 className="text-center" style={{ color: 'var(--primary-color)' }}>Tailspend Management Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="e.g., business.user, procurement.officer, supplier.alpha"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message text-center">{error}</p>}
          <div className="form-actions" style={{ justifyContent: 'center' }}>
            <button type="submit" className="btn btn-primary">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};


const Header = () => {
  const { currentUser, logout, canAccess } = useContext(AuthContext);
  const { navigate, currentScreen, goBack, screenHistory, resetToDashboard } = useContext(NavigationContext);
  const { addNotification } = useContext(NotificationContext);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    addNotification('Logged out successfully.', 'info', 'Logout');
  };

  const handleSearch = (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
          addNotification(`Searching for: ${searchQuery}`, 'info', 'Global Search');
          // In a real app, this would navigate to a search results page
          // For now, just a notification.
          setSearchQuery('');
          setShowGlobalSearch(false);
      }
  }

  return (
    <header className="header">
      <h1 className="header-title" onClick={resetToDashboard} style={{ cursor: 'pointer' }}>Tailspend Management</h1>
      <div className="header-actions">
        {currentUser && (
            <>
                <div className="global-search">
                    <button className="btn btn-text" style={{ color: 'white' }} onClick={() => setShowGlobalSearch(!showGlobalSearch)}>
                        <FaSearch />
                    </button>
                    {showGlobalSearch && (
                        <form onSubmit={handleSearch} style={{ position: 'absolute', right: 0, top: '100%', marginTop: 'var(--spacing-sm)' }}>
                            <input
                                type="text"
                                placeholder="Global search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onBlur={() => setTimeout(() => setShowGlobalSearch(false), 200)} // delay to allow click
                                autoFocus
                            />
                        </form>
                    )}
                </div>
                <div className="header-user">
                    <span className="header-user-avatar">{currentUser.name.charAt(0)}</span>
                    <span>{currentUser.name} ({currentUser.role})</span>
                    <button className="btn btn-text" style={{ color: 'white' }} onClick={handleLogout}>
                    <FaTimes /> Logout
                    </button>
                </div>
            </>
        )}
      </div>
    </header>
  );
};


const Sidebar = () => {
  const { currentUser, canAccess } = useContext(AuthContext);
  const { navigate, currentScreen, resetToDashboard } = useContext(NavigationContext);

  const navItems = [
    { name: 'Dashboard', icon: <FaHome /> },
    { name: 'RFQsList', icon: <FaClipboardList />, label: 'RFQs' },
    { name: 'PurchaseOrdersList', icon: <FaFileInvoiceDollar />, label: 'Purchase Orders' },
    { name: 'SupplierOnboardingList', icon: <FaUsers />, label: 'Suppliers' },
    { name: 'AuditLogsScreen', icon: <FaHistory />, label: 'Audit Logs' },
  ];

  if (!currentUser) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">TSM</div>
      <nav className="sidebar-nav">
        {navItems.map(item =>
          canAccess(item.name) ? (
            <li key={item.name} className="sidebar-nav-item">
              <button
                className={currentScreen.name === item.name ? 'active' : ''}
                onClick={() => navigate(item.name)}
              >
                {item.icon}
                <span>{item.label || item.name.replace(/([A-Z])/g, ' $1').trim()}</span>
              </button>
            </li>
          ) : null
        )}
      </nav>
    </aside>
  );
};

const RFQForm = ({ rfqId, mode = 'create' }) => {
    const { currentUser, canAccess } = useContext(AuthContext);
    const { goBack, navigate } = useContext(NavigationContext);
    const { addNotification } = useContext(NotificationContext);

    const isEdit = mode === 'edit' && rfqId;
    const existingRfq = isEdit ? dummyRFQs.find(r => r.id === rfqId) : null;

    const [formData, setFormData] = useState({
      id: rfqId || `RFQ-${Math.floor(Math.random() * 10000)}`,
      title: '',
      description: '',
      category: '',
      budget: '',
      dueDate: '',
      assignedSuppliers: [],
      attachments: [],
      ...existingRfq, // Pre-fill if editing
    });

    const [formErrors, setFormErrors] = useState({});
    const [fileUploads, setFileUploads] = useState(existingRfq?.attachments || []);

    useEffect(() => {
        if (isEdit && !existingRfq) {
            addNotification('RFQ not found or you do not have permission to edit.', 'error', 'Error');
            goBack();
        }
        if (isEdit) {
          if (!canAccess('rfq', existingRfq, 'edit')) {
              addNotification('You do not have permission to edit this RFQ.', 'error', 'Permission Denied');
              goBack();
          }
        } else { // Create mode
            if (!canAccess('action', 'CreateRFQ')) {
                addNotification('You do not have permission to create an RFQ.', 'error', 'Permission Denied');
                goBack();
            }
        }
    }, [rfqId, isEdit, existingRfq, canAccess, goBack, addNotification]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFileUploads(prev => [...prev, ...files.map(file => ({ name: file.name, url: URL.createObjectURL(file), type: file.type }))]);
        addNotification(`Uploaded ${files.length} file(s).`, 'info');
    };

    const removeFile = (index) => {
        setFileUploads(prev => prev.filter((_, i) => i !== index));
        addNotification('File removed.', 'info');
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.title) errors.title = 'Title is mandatory.';
        if (!formData.description) errors.description = 'Description is mandatory.';
        if (!formData.category) errors.category = 'Category is mandatory.';
        if (!formData.budget || isNaN(formData.budget) || formData.budget <= 0) errors.budget = 'Budget must be a positive number.';
        if (!formData.dueDate) errors.dueDate = 'Due Date is mandatory.';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!validateForm()) {
          addNotification('Please correct the form errors.', 'error', 'Validation Error');
          return;
      }

      if (isEdit) {
        dummyRFQs = dummyRFQs.map(rfq => rfq.id === formData.id ? { ...rfq, ...formData, attachments: fileUploads } : rfq);
        addNotification(`RFQ ${formData.id} updated successfully!`, 'success', 'Update Success');
      } else {
        const newRfq = {
          ...formData,
          initiatorId: currentUser.id,
          initiatorName: currentUser.name,
          status: 'Draft',
          creationDate: new Date().toISOString().split('T')[0],
          workflowHistory: [{ stage: 'Draft', by: currentUser.name, date: new Date().toISOString().split('T')[0] }],
          attachments: fileUploads,
          quotes: []
        };
        dummyRFQs.push(newRfq);
        addNotification(`New RFQ ${newRfq.id} created successfully!`, 'success', 'Creation Success');
      }
      goBack(); // Navigate back to the list or detail view
    };

    return (
        <div className="full-screen-page">
            <div className="full-screen-header">
                <div className="flex items-center gap-md">
                    <button className="btn btn-outline" onClick={goBack}><FaArrowLeft /> Back</button>
                    <h1>{isEdit ? `Edit RFQ: ${formData.id}` : 'Create New RFQ'}</h1>
                </div>
                <div className="full-screen-actions">
                    <button className="btn btn-primary" onClick={handleSubmit}><FaCheckCircle /> Save RFQ</button>
                </div>
            </div>

            <div className="form-container">
                <form>
                    <div className="form-group">
                        <label htmlFor="title">RFQ Title <span style={{ color: 'var(--status-red)' }}>*</span></label>
                        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Procurement of IT Services" />
                        {formErrors.title && <p className="error-message">{formErrors.title}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description <span style={{ color: 'var(--status-red)' }}>*</span></label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Provide a detailed description of the required goods or services."></textarea>
                        {formErrors.description && <p className="error-message">{formErrors.description}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">Category <span style={{ color: 'var(--status-red)' }}>*</span></label>
                        <select id="category" name="category" value={formData.category} onChange={handleChange}>
                            <option value="">Select Category</option>
                            <option value="IT Services">IT Services</option>
                            <option value="Office Supplies">Office Supplies</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Facility Maint.">Facility Maintenance</option>
                            <option value="Travel">Travel</option>
                        </select>
                        {formErrors.category && <p className="error-message">{formErrors.category}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-md">
                        <div className="form-group">
                            <label htmlFor="budget">Estimated Budget ($) <span style={{ color: 'var(--status-red)' }}>*</span></label>
                            <input type="number" id="budget" name="budget" value={formData.budget} onChange={handleChange} placeholder="e.g., 5000" />
                            {formErrors.budget && <p className="error-message">{formErrors.budget}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="dueDate">Due Date <span style={{ color: 'var(--status-red)' }}>*</span></label>
                            <input type="date" id="dueDate" name="dueDate" value={formData.dueDate} onChange={handleChange} />
                            {formErrors.dueDate && <p className="error-message">{formErrors.dueDate}</p>}
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Attachments</label>
                        <div className="file-upload-container">
                            <input type="file" multiple onChange={handleFileChange} />
                            <p>Drag & drop files here or click to upload</p>
                            <FaFileUpload style={{ marginTop: 'var(--spacing-sm)', fontSize: '2em', color: 'var(--border-color)' }} />
                        </div>
                        {fileUploads.length > 0 && (
                            <div className="file-upload-list">
                                {fileUploads.map((file, index) => (
                                    <div key={index} className="file-upload-item">
                                        <span>{file.name}</span>
                                        <button className="btn btn-text" onClick={() => removeFile(index)}><FaTimes /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Auto-populated fields (read-only for display, backend manages) */}
                    {isEdit && (
                        <div className="grid grid-cols-2 gap-md">
                            <div className="form-group">
                                <label>Initiator</label>
                                <input type="text" value={formData.initiatorName} readOnly disabled />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <input type="text" value={formData.status} readOnly disabled />
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

const RFQDetail = ({ rfqId }) => {
    const { currentUser, canAccess } = useContext(AuthContext);
    const { goBack, navigate } = useContext(NavigationContext);
    const { addNotification } = useContext(NotificationContext);

    const rfq = dummyRFQs.find(r => r.id === rfqId);

    if (!rfq || !canAccess('rfq', rfq, 'view')) {
      addNotification('RFQ not found or you do not have permission to view it.', 'error', 'Permission Denied');
      return (
        <div className="full-screen-page">
          <button className="btn btn-outline mb-md" onClick={goBack}><FaArrowLeft /> Back</button>
          <p>Access Denied or RFQ Not Found.</p>
        </div>
      );
    }

    const isBusinessUser = currentUser.role === 'Business User';
    const isProcurementOfficer = currentUser.role === 'Procurement Officer';
    const isSupplier = currentUser.role === 'Supplier';

    const rfqWorkflowStages = [
        { status: 'Draft', label: 'Draft', icon: <FaLightbulb /> },
        { status: 'Open', label: 'Open', icon: <FaBoxOpen /> },
        { status: 'Quotes Received', label: 'Quotes Received', icon: <FaClipboardList /> },
        { status: 'Pending Approval', label: 'Pending Approval', icon: <FaHourglassHalf /> },
        { status: 'Evaluation', label: 'Evaluation', icon: <FaHammer /> }, // Manual stage for PO
        { status: 'Awarded', label: 'Awarded', icon: <FaAward /> },
        { status: 'Rejected', label: 'Rejected', icon: <FaTimesCircle /> },
        { status: 'Closed', label: 'Closed', icon: <FaCheckCircle /> },
    ];

    const handleAction = (action) => {
        if (!canAccess('action', action)) {
            addNotification('You do not have permission for this action.', 'error', 'Permission Denied');
            return;
        }
        let message = '';
        switch (action) {
            case 'EditMyRFQ':
                navigate('RFQForm', { rfqId: rfq.id, mode: 'edit' });
                return;
            case 'ApproveRFQ':
                rfq.status = 'Approved';
                rfq.workflowHistory.push({ stage: 'Approved', by: currentUser.name, date: new Date().toISOString().split('T')[0] });
                message = `RFQ ${rfq.id} approved!`;
                break;
            case 'RejectRFQ':
                rfq.status = 'Rejected';
                rfq.workflowHistory.push({ stage: 'Rejected', by: currentUser.name, date: new Date().toISOString().split('T')[0] });
                message = `RFQ ${rfq.id} rejected.`;
                break;
            case 'CancelMyRFQ':
                rfq.status = 'Canceled';
                rfq.workflowHistory.push({ stage: 'Canceled', by: currentUser.name, date: new Date().toISOString().split('T')[0] });
                message = `RFQ ${rfq.id} canceled.`;
                break;
            case 'RespondToRFQ':
                navigate('SupplierResponseForm', { rfqId: rfq.id });
                return;
            case 'CreatePO':
                navigate('POForm', { rfqId: rfq.id, mode: 'create', prefill: { rfqId: rfq.id, supplierId: rfq.quotes.find(q => q.status === 'Awarded')?.supplierId, amount: rfq.quotes.find(q => q.status === 'Awarded')?.amount || 0 }});
                return;
            case 'ViewPO':
                const relatedPO = dummyPOs.find(po => po.rfqId === rfq.id);
                if (relatedPO) {
                    navigate('PurchaseOrderDetail', { poId: relatedPO.id });
                } else {
                    addNotification('No related Purchase Order found.', 'info', 'No PO');
                }
                return;
            default:
                message = `Action "${action}" performed for RFQ ${rfq.id}.`;
        }
        addNotification(message, 'success');
        // Force re-render to update status
        dummyRFQs = [...dummyRFQs]; // Simple way to trigger React state update for dummy data
        navigate('RFQDetail', { rfqId: rfq.id }); // Re-navigate to refresh detail
    };

    return (
        <div className="full-screen-page">
            <div className="breadcrumb">
                <a onClick={goBack}>RFQs</a><span>/</span><span>{rfq.id}</span>
            </div>
            <div className="full-screen-header">
                <div className="flex items-center gap-md">
                    <button className="btn btn-outline" onClick={goBack}><FaArrowLeft /> Back</button>
                    <h1>RFQ: {rfq.title}</h1>
                </div>
                <div className="full-screen-actions">
                    {canAccess('rfq', rfq, 'edit') && rfq.initiatorId === currentUser.id && canAccess('action', 'EditMyRFQ') && (
                        <button className="btn btn-secondary" onClick={() => handleAction('EditMyRFQ')}><FaEdit /> Edit</button>
                    )}
                    {canAccess('rfq', rfq, 'edit') && rfq.initiatorId === currentUser.id && canAccess('action', 'CancelMyRFQ') && (rfq.status === 'Draft' || rfq.status === 'Open') && (
                        <button className="btn btn-outline" style={{ borderColor: 'var(--status-red)', color: 'var(--status-red)' }} onClick={() => handleAction('CancelMyRFQ')}><FaTimesCircle /> Cancel RFQ</button>
                    )}
                    {isProcurementOfficer && rfq.status === 'Pending Approval' && canAccess('action', 'ApproveRFQ') && (
                        <button className="btn btn-primary" onClick={() => handleAction('ApproveRFQ')}><FaCheckCircle /> Approve</button>
                    )}
                    {isProcurementOfficer && rfq.status === 'Pending Approval' && canAccess('action', 'RejectRFQ') && (
                        <button className="btn btn-outline" style={{ borderColor: 'var(--status-red)', color: 'var(--status-red)' }} onClick={() => handleAction('RejectRFQ')}><FaTimesCircle /> Reject</button>
                    )}
                    {isProcurementOfficer && rfq.status === 'Awarded' && canAccess('action', 'CreatePO') && !dummyPOs.some(po => po.rfqId === rfq.id) && (
                        <button className="btn btn-secondary" onClick={() => handleAction('CreatePO')}><FaPlus /> Create PO</button>
                    )}
                    {(isBusinessUser || isProcurementOfficer) && rfq.status === 'Awarded' && dummyPOs.some(po => po.rfqId === rfq.id) && canAccess('po', dummyPOs.find(po => po.rfqId === rfq.id), 'view') && (
                        <button className="btn btn-primary" onClick={() => handleAction('ViewPO')}><FaFileInvoiceDollar /> View PO</button>
                    )}
                    {isSupplier && canAccess('rfq', rfq, 'respond') && (
                        <button className="btn btn-primary" onClick={() => handleAction('RespondToRFQ')}><FaEdit /> Respond to RFQ</button>
                    )}
                </div>
            </div>

            <WorkflowTracker workflowHistory={rfq.workflowHistory} currentStatus={rfq.status} stagesConfig={rfqWorkflowStages} />

            <div className="detail-section">
                <h3>RFQ Details</h3>
                <div className="detail-grid">
                    <div className="detail-item"><label>ID:</label><span>{rfq.id}</span></div>
                    <div className="detail-item"><label>Title:</label><span>{rfq.title}</span></div>
                    <div className="detail-item"><label>Status:</label><span className={`status-badge ${getStatusColorClass(rfq.status)}`}>{rfq.status}</span></div>
                    <div className="detail-item"><label>Category:</label><span>{rfq.category}</span></div>
                    <div className="detail-item"><label>Initiator:</label><span>{rfq.initiatorName}</span></div>
                    <div className="detail-item"><label>Budget:</label><span>${rfq.budget?.toLocaleString()}</span></div>
                    <div className="detail-item"><label>Creation Date:</label><span>{rfq.creationDate}</span></div>
                    <div className="detail-item"><label>Due Date:</label><span>{rfq.dueDate}</span></div>
                </div>
                <div className="detail-item mt-md"><label>Description:</label><span>{rfq.description}</span></div>
            </div>

            {(isProcurementOfficer || (isBusinessUser && rfq.initiatorId === currentUser.id)) && (
                <div className="detail-section">
                    <h3>Assigned Suppliers</h3>
                    {rfq.assignedSuppliers.length > 0 ? (
                        <ul className="file-upload-list" style={{ boxShadow: 'none', border: 'none' }}>
                            {rfq.assignedSuppliers.map(supplierId => {
                                const supplier = dummySuppliers.find(s => s.id === supplierId);
                                return (
                                    <li key={supplierId} className="file-upload-item">
                                        <span>{supplier?.name || `Unknown Supplier (${supplierId})`}</span>
                                        {(isProcurementOfficer || isBusinessUser) && (
                                            <button className="btn btn-text" onClick={() => navigate('SupplierOnboardingDetail', { supplierId: supplierId })}><FaEye /> View Profile</button>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p>No suppliers assigned yet.</p>
                    )}
                </div>
            )}

            {rfq.quotes && rfq.quotes.length > 0 && (isProcurementOfficer || (isSupplier && rfq.quotes.some(q => q.supplierId === currentUser.id)) || (isBusinessUser && rfq.initiatorId === currentUser.id)) && (
                <div className="detail-section">
                    <h3>Quotes Received</h3>
                    <div className="data-grid-container">
                        <table className="data-grid-table">
                            <thead>
                                <tr>
                                    <th>Supplier</th>
                                    <th>Amount</th>
                                    <th>Submission Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rfq.quotes.filter(q => isProcurementOfficer || q.supplierId === currentUser.id || (isBusinessUser && rfq.initiatorId === currentUser.id)).map(quote => (
                                    <tr key={quote.id}>
                                        <td>{quote.supplierName}</td>
                                        <td>${quote.amount?.toLocaleString()}</td>
                                        <td>{quote.submissionDate}</td>
                                        <td><span className={`status-badge ${getStatusColorClass(quote.status)}`}>{quote.status}</span></td>
                                        <td>
                                            {isProcurementOfficer && rfq.status === 'Quotes Received' && (
                                                <>
                                                    <button className="btn btn-text" onClick={() => { quote.status = 'Awarded'; rfq.status = 'Awarded'; addNotification(`Quote ${quote.id} awarded!`, 'success'); navigate('RFQDetail', { rfqId: rfq.id }); }}><FaAward /> Award</button>
                                                    <button className="btn btn-text" onClick={() => { quote.status = 'Rejected'; addNotification(`Quote ${quote.id} rejected.`, 'info'); navigate('RFQDetail', { rfqId: rfq.id }); }}><FaTimes /> Reject</button>
                                                </>
                                            )}
                                            {quote.quoteAttachments && quote.quoteAttachments.length > 0 && (
                                                <a href={quote.quoteAttachments[0].url} target="_blank" rel="noopener noreferrer" className="btn btn-text"><FaDownload /> Doc</a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {rfq.attachments && rfq.attachments.length > 0 && (
                <div className="detail-section">
                    <h3>Documents</h3>
                    <ul className="file-upload-list" style={{ boxShadow: 'none', border: 'none' }}>
                        {rfq.attachments.map((file, index) => (
                            <li key={index} className="file-upload-item">
                                <span>{file.name}</span>
                                <a href={file.url} target="_blank" rel="noopener noreferrer" className="btn btn-text"><FaDownload /> Preview</a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const RFQsList = () => {
  const { currentUser, canAccess } = useContext(AuthContext);
  const { navigate } = useContext(NavigationContext);
  const { addNotification } = useContext(NotificationContext);

  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const filteredRFQs = dummyRFQs.filter(rfq => {
    const userCanView = canAccess('rfq', rfq, 'view');
    if (!userCanView) return false;

    const matchesStatus = filterStatus === 'All' || rfq.status === filterStatus;
    const matchesSearch = rfq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rfq.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rfq.initiatorName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const uniqueStatuses = ['All', ...new Set(dummyRFQs.map(rfq => rfq.status))];

  const handleCreateRFQ = () => {
    if (canAccess('action', 'CreateRFQ')) {
        navigate('RFQForm', { mode: 'create' });
    } else {
        addNotification('You do not have permission to create an RFQ.', 'error', 'Permission Denied');
    }
  };

  const RENDER_FILTERS = (
    <div className="data-grid-filters">
      <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="btn">
        {uniqueStatuses.map(status => <option key={status} value={status}>{status}</option>)}
      </select>
      <button className="btn btn-outline" onClick={() => setShowFilterPanel(true)}><FaFilter /> Advanced Filters</button>
    </div>
  );

  const FilterPanel = ({ onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
      <div className="filter-panel" onClick={(e) => e.stopPropagation()}>
        <div className="filter-panel-header">
          <h3>Advanced Filters</h3>
          <button className="btn btn-text" onClick={onClose}><FaTimes /></button>
        </div>
        <div className="filter-panel-body">
          <div className="form-group">
            <label>Category</label>
            <select>
              <option value="">All Categories</option>
              <option value="IT Services">IT Services</option>
              <option value="Office Supplies">Office Supplies</option>
            </select>
          </div>
          <div className="form-group">
            <label>Budget Range</label>
            <input type="number" placeholder="Min Budget" />
            <input type="number" placeholder="Max Budget" style={{ marginTop: 'var(--spacing-sm)' }} />
          </div>
        </div>
        <div className="filter-panel-footer">
          <button className="btn btn-outline" onClick={onClose}>Reset</button>
          <button className="btn btn-primary" onClick={onClose}>Apply Filters</button>
        </div>
      </div>
    </div>
  );


  return (
    <div className="main-content">
      <h1 style={{ marginBottom: 'var(--spacing-md)' }}>Requests for Quotation (RFQs)</h1>

      <div className="data-grid-toolbar">
        <input
          type="text"
          placeholder="Search RFQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {RENDER_FILTERS}
        <div className="ml-auto">
          {canAccess('action', 'CreateRFQ') && (
            <button className="btn btn-primary" onClick={handleCreateRFQ}>
              <FaPlus /> Create New RFQ
            </button>
          )}
        </div>
      </div>

      {filteredRFQs.length > 0 ? (
        <div className="card-grid">
          {filteredRFQs.map(rfq => (
            <CardComponent
              key={rfq.id}
              title={rfq.title}
              status={rfq.status}
              onClick={() => navigate('RFQDetail', { rfqId: rfq.id })}
              details={{
                'ID': rfq.id,
                'Initiator': rfq.initiatorName,
                'Due Date': rfq.dueDate,
                'Budget': `$${rfq.budget?.toLocaleString()}`
              }}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <FaClipboardList className="icon" />
          <h3>No RFQs match your criteria.</h3>
          <p>It looks like there are no RFQs to display right now, or your filters are too restrictive.</p>
          {canAccess('action', 'CreateRFQ') && (
            <button className="btn btn-primary mt-md" onClick={handleCreateRFQ}>
              <FaPlus /> Create Your First RFQ
            </button>
          )}
        </div>
      )}
      {showFilterPanel && <FilterPanel onClose={() => setShowFilterPanel(false)} />}
    </div>
  );
};

const SupplierResponseForm = ({ rfqId }) => {
  const { currentUser, canAccess } = useContext(AuthContext);
  const { goBack } = useContext(NavigationContext);
  const { addNotification } = useContext(NotificationContext);

  const rfq = dummyRFQs.find(r => r.id === rfqId);
  const existingQuote = rfq?.quotes?.find(q => q.supplierId === currentUser.id);

  const [formData, setFormData] = useState({
    amount: existingQuote?.amount || '',
    terms: existingQuote?.terms || 'Net 30',
    submissionDate: existingQuote?.submissionDate || new Date().toISOString().split('T')[0],
  });
  const [fileUploads, setFileUploads] = useState(existingQuote?.quoteAttachments || []);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (!rfq || !canAccess('rfq', rfq, 'respond')) {
      addNotification('You do not have permission to respond to this RFQ or RFQ is not open.', 'error', 'Permission Denied');
      goBack();
    }
  }, [rfq, canAccess, goBack, addNotification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFileUploads(prev => [...prev, ...files.map(file => ({ name: file.name, url: URL.createObjectURL(file), type: file.type }))]);
    addNotification(`Uploaded ${files.length} file(s).`, 'info');
  };

  const removeFile = (index) => {
    setFileUploads(prev => prev.filter((_, i) => i !== index));
    addNotification('File removed.', 'info');
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.amount || isNaN(formData.amount) || formData.amount <= 0) errors.amount = 'Quote amount must be a positive number.';
    if (!formData.terms) errors.terms = 'Payment terms are mandatory.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      addNotification('Please correct the form errors.', 'error', 'Validation Error');
      return;
    }

    if (rfq) {
      const newQuote = {
        id: existingQuote?.id || `Q-${generateId()}`,
        rfqId: rfq.id,
        supplierId: currentUser.id,
        supplierName: currentUser.name,
        ...formData,
        quoteAttachments: fileUploads,
        status: 'Submitted'
      };

      if (existingQuote) {
        // Update existing quote
        rfq.quotes = rfq.quotes.map(q => q.id === newQuote.id ? newQuote : q);
        addNotification(`Quote for RFQ ${rfq.id} updated successfully!`, 'success');
      } else {
        // Add new quote
        rfq.quotes.push(newQuote);
        rfq.status = 'Quotes Received'; // Update RFQ status
        addNotification(`Quote submitted successfully for RFQ ${rfq.id}!`, 'success');
      }
    }
    goBack();
  };

  return (
    <div className="full-screen-page">
      <div className="full-screen-header">
        <div className="flex items-center gap-md">
          <button className="btn btn-outline" onClick={goBack}><FaArrowLeft /> Back</button>
          <h1>Respond to RFQ: {rfq?.title || 'N/A'}</h1>
        </div>
        <div className="full-screen-actions">
          <button className="btn btn-primary" onClick={handleSubmit}><FaCheckCircle /> Submit Quote</button>
        </div>
      </div>

      <div className="form-container">
        <form>
          <div className="form-group">
            <label htmlFor="amount">Quoted Amount ($) <span style={{ color: 'var(--status-red)' }}>*</span></label>
            <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} placeholder="e.g., 4500" />
            {formErrors.amount && <p className="error-message">{formErrors.amount}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="terms">Payment Terms <span style={{ color: 'var(--status-red)' }}>*</span></label>
            <input type="text" id="terms" name="terms" value={formData.terms} onChange={handleChange} placeholder="e.g., Net 30, COD" />
            {formErrors.terms && <p className="error-message">{formErrors.terms}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="submissionDate">Submission Date</label>
            <input type="date" id="submissionDate" name="submissionDate" value={formData.submissionDate} onChange={handleChange} readOnly disabled />
          </div>
          <div className="form-group">
            <label>Quote Attachments</label>
            <div className="file-upload-container">
              <input type="file" multiple onChange={handleFileChange} />
              <p>Drag & drop quote documents here or click to upload</p>
              <FaFileUpload style={{ marginTop: 'var(--spacing-sm)', fontSize: '2em', color: 'var(--border-color)' }} />
            </div>
            {fileUploads.length > 0 && (
              <div className="file-upload-list">
                {fileUploads.map((file, index) => (
                  <div key={index} className="file-upload-item">
                    <span>{file.name}</span>
                    <button className="btn btn-text" onClick={() => removeFile(index)}><FaTimes /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};


const POForm = ({ poId, mode = 'create', prefill = {} }) => {
    const { currentUser, canAccess } = useContext(AuthContext);
    const { goBack, navigate } = useContext(NavigationContext);
    const { addNotification } = useContext(NotificationContext);

    const isEdit = mode === 'edit' && poId;
    const existingPO = isEdit ? dummyPOs.find(po => po.id === poId) : null;

    const [formData, setFormData] = useState({
        id: poId || `PO-${Math.floor(Math.random() * 10000)}`,
        rfqId: prefill.rfqId || '',
        title: prefill.title || '',
        description: prefill.description || '',
        supplierId: prefill.supplierId || '',
        amount: prefill.amount || '',
        deliveryDate: prefill.deliveryDate || '',
        paymentTerms: existingPO?.paymentTerms || 'Net 30',
        attachments: [],
        ...existingPO,
    });
    const [formErrors, setFormErrors] = useState({});
    const [fileUploads, setFileUploads] = useState(existingPO?.attachments || []);

    useEffect(() => {
        if (isEdit) {
            if (!existingPO || !canAccess('po', existingPO, 'edit')) {
                addNotification('PO not found or you do not have permission to edit.', 'error', 'Error');
                goBack();
            }
        } else { // Create mode
            if (!canAccess('action', 'CreatePO')) {
                addNotification('You do not have permission to create a PO.', 'error', 'Permission Denied');
                goBack();
            }
            if (prefill.rfqId) {
                const rfq = dummyRFQs.find(r => r.id === prefill.rfqId);
                const awardedQuote = rfq?.quotes?.find(q => q.status === 'Awarded');
                if (rfq && awardedQuote) {
                    setFormData(prev => ({
                        ...prev,
                        title: `Purchase Order for RFQ ${rfq.id} - ${rfq.title}`,
                        description: rfq.description,
                        supplierId: awardedQuote.supplierId,
                        amount: awardedQuote.amount,
                        rfqId: rfq.id
                    }));
                }
            }
        }
    }, [poId, isEdit, existingPO, canAccess, goBack, addNotification, prefill]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFileUploads(prev => [...prev, ...files.map(file => ({ name: file.name, url: URL.createObjectURL(file), type: file.type }))]);
        addNotification(`Uploaded ${files.length} file(s).`, 'info');
    };

    const removeFile = (index) => {
        setFileUploads(prev => prev.filter((_, i) => i !== index));
        addNotification('File removed.', 'info');
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.title) errors.title = 'Title is mandatory.';
        if (!formData.description) errors.description = 'Description is mandatory.';
        if (!formData.supplierId) errors.supplierId = 'Supplier is mandatory.';
        if (!formData.amount || isNaN(formData.amount) || formData.amount <= 0) errors.amount = 'Amount must be a positive number.';
        if (!formData.deliveryDate) errors.deliveryDate = 'Delivery Date is mandatory.';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            addNotification('Please correct the form errors.', 'error', 'Validation Error');
            return;
        }

        const supplierName = dummySuppliers.find(s => s.id === formData.supplierId)?.name || 'Unknown Supplier';

        if (isEdit) {
            dummyPOs = dummyPOs.map(po => po.id === formData.id ? { ...po, ...formData, supplierName, attachments: fileUploads } : po);
            addNotification(`PO ${formData.id} updated successfully!`, 'success', 'Update Success');
        } else {
            const newPO = {
                ...formData,
                initiatorId: currentUser.id,
                initiatorName: currentUser.name,
                supplierName: supplierName,
                status: 'Draft',
                orderDate: new Date().toISOString().split('T')[0],
                workflowHistory: [{ stage: 'Draft', by: currentUser.name, date: new Date().toISOString().split('T')[0] }],
                attachments: fileUploads,
            };
            dummyPOs.push(newPO);
            addNotification(`New PO ${newPO.id} created successfully!`, 'success', 'Creation Success');
        }
        goBack(); // Navigate back to the list or detail view
    };

    return (
        <div className="full-screen-page">
            <div className="full-screen-header">
                <div className="flex items-center gap-md">
                    <button className="btn btn-outline" onClick={goBack}><FaArrowLeft /> Back</button>
                    <h1>{isEdit ? `Edit Purchase Order: ${formData.id}` : 'Create New Purchase Order'}</h1>
                </div>
                <div className="full-screen-actions">
                    <button className="btn btn-primary" onClick={handleSubmit}><FaCheckCircle /> Save PO</button>
                </div>
            </div>

            <div className="form-container">
                <form>
                    <div className="form-group">
                        <label htmlFor="title">PO Title <span style={{ color: 'var(--status-red)' }}>*</span></label>
                        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Purchase for IT Hardware" />
                        {formErrors.title && <p className="error-message">{formErrors.title}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description <span style={{ color: 'var(--status-red)' }}>*</span></label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Provide details about the items or services being purchased."></textarea>
                        {formErrors.description && <p className="error-message">{formErrors.description}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="supplierId">Supplier <span style={{ color: 'var(--status-red)' }}>*</span></label>
                        <select id="supplierId" name="supplierId" value={formData.supplierId} onChange={handleChange}>
                            <option value="">Select Supplier</option>
                            {dummySuppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        {formErrors.supplierId && <p className="error-message">{formErrors.supplierId}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-md">
                        <div className="form-group">
                            <label htmlFor="amount">Amount ($) <span style={{ color: 'var(--status-red)' }}>*</span></label>
                            <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} placeholder="e.g., 9999" />
                            {formErrors.amount && <p className="error-message">{formErrors.amount}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="deliveryDate">Expected Delivery Date <span style={{ color: 'var(--status-red)' }}>*</span></label>
                            <input type="date" id="deliveryDate" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange} />
                            {formErrors.deliveryDate && <p className="error-message">{formErrors.deliveryDate}</p>}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="paymentTerms">Payment Terms</label>
                        <input type="text" id="paymentTerms" name="paymentTerms" value={formData.paymentTerms} onChange={handleChange} placeholder="e.g., Net 30" />
                    </div>
                    <div className="form-group">
                        <label>Attachments</label>
                        <div className="file-upload-container">
                            <input type="file" multiple onChange={handleFileChange} />
                            <p>Drag & drop files here or click to upload</p>
                            <FaFileUpload style={{ marginTop: 'var(--spacing-sm)', fontSize: '2em', color: 'var(--border-color)' }} />
                        </div>
                        {fileUploads.length > 0 && (
                            <div className="file-upload-list">
                                {fileUploads.map((file, index) => (
                                    <div key={index} className="file-upload-item">
                                        <span>{file.name}</span>
                                        <button className="btn btn-text" onClick={() => removeFile(index)}><FaTimes /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {isEdit && (
                        <div className="grid grid-cols-2 gap-md">
                            <div className="form-group">
                                <label>Initiator</label>
                                <input type="text" value={formData.initiatorName} readOnly disabled />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <input type="text" value={formData.status} readOnly disabled />
                            </div>
                            <div className="form-group">
                                <label>Related RFQ ID</label>
                                <input type="text" value={formData.rfqId || 'N/A'} readOnly disabled />
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

const PurchaseOrderDetail = ({ poId }) => {
  const { currentUser, canAccess } = useContext(AuthContext);
  const { goBack, navigate } = useContext(NavigationContext);
  const { addNotification } = useContext(NotificationContext);

  const po = dummyPOs.find(p => p.id === poId);

  if (!po || !canAccess('po', po, 'view')) {
    addNotification('Purchase Order not found or you do not have permission to view it.', 'error', 'Permission Denied');
    return (
      <div className="full-screen-page">
        <button className="btn btn-outline mb-md" onClick={goBack}><FaArrowLeft /> Back</button>
        <p>Access Denied or PO Not Found.</p>
      </div>
    );
  }

  const isProcurementOfficer = currentUser.role === 'Procurement Officer';
  const isSupplier = currentUser.role === 'Supplier' && po.supplierId === currentUser.id;

  const poWorkflowStages = [
    { status: 'Draft', label: 'Draft', icon: <FaLightbulb /> },
    { status: 'Pending Approval', label: 'Pending Approval', icon: <FaHourglassHalf /> },
    { status: 'Approved', label: 'Approved', icon: <FaCheckCircle /> },
    { status: 'Sent to Supplier', label: 'Sent to Supplier', icon: <FaExchangeAlt /> },
    { status: 'Acknowledged', label: 'Acknowledged', icon: <FaClipboardCheck /> },
    { status: 'Partially Fulfilled', label: 'Partially Fulfilled', icon: <FaTasks /> },
    { status: 'Fulfilled', label: 'Fulfilled', icon: <FaTasks /> },
    { status: 'Closed', label: 'Closed', icon: <FaCheckCircle /> },
  ];


  const handleAction = (action) => {
    if (!canAccess('action', action)) {
        addNotification('You do not have permission for this action.', 'error', 'Permission Denied');
        return;
    }
    let message = '';
    switch (action) {
        case 'EditPO':
            navigate('POForm', { poId: po.id, mode: 'edit' });
            return;
        case 'ApprovePO': // For Procurement Officer to Approve a PO
            po.status = 'Approved';
            po.workflowHistory.push({ stage: 'Approved', by: currentUser.name, date: new Date().toISOString().split('T')[0] });
            message = `PO ${po.id} approved!`;
            break;
        case 'RejectPO': // For Procurement Officer to Reject a PO
            po.status = 'Rejected';
            po.workflowHistory.push({ stage: 'Rejected', by: currentUser.name, date: new Date().toISOString().split('T')[0] });
            message = `PO ${po.id} rejected.`;
            break;
        case 'AcknowledgePO': // For Supplier to Acknowledge a PO
            po.status = 'Acknowledged';
            po.workflowHistory.push({ stage: 'Acknowledged', by: currentUser.name, date: new Date().toISOString().split('T')[0] });
            message = `PO ${po.id} acknowledged.`;
            break;
        case 'MarkFulfilled': // For Procurement Officer/Warehouse
            po.status = 'Fulfilled';
            po.workflowHistory.push({ stage: 'Fulfilled', by: currentUser.name, date: new Date().toISOString().split('T')[0] });
            message = `PO ${po.id} marked as fulfilled.`;
            break;
        case 'ClosePO': // For Procurement Officer
            po.status = 'Closed';
            po.workflowHistory.push({ stage: 'Closed', by: currentUser.name, date: new Date().toISOString().split('T')[0] });
            message = `PO ${po.id} closed.`;
            break;
        case 'ViewRFQ':
            if (po.rfqId) {
                navigate('RFQDetail', { rfqId: po.rfqId });
            } else {
                addNotification('No related RFQ found.', 'info', 'No RFQ');
            }
            return;
        default:
            message = `Action "${action}" performed for PO ${po.id}.`;
    }
    addNotification(message, 'success');
    // Force re-render to update status
    dummyPOs = [...dummyPOs];
    navigate('PurchaseOrderDetail', { poId: po.id }); // Re-navigate to refresh detail
  };

  return (
    <div className="full-screen-page">
      <div className="breadcrumb">
        <a onClick={goBack}>Purchase Orders</a><span>/</span><span>{po.id}</span>
      </div>
      <div className="full-screen-header">
        <div className="flex items-center gap-md">
          <button className="btn btn-outline" onClick={goBack}><FaArrowLeft /> Back</button>
          <h1>Purchase Order: {po.title}</h1>
        </div>
        <div className="full-screen-actions">
          {isProcurementOfficer && canAccess('po', po, 'edit') && (po.status === 'Draft' || po.status === 'Pending Approval') && (
            <button className="btn btn-secondary" onClick={() => handleAction('EditPO')}><FaEdit /> Edit</button>
          )}
          {isProcurementOfficer && po.status === 'Pending Approval' && canAccess('action', 'ApprovePO') && (
            <button className="btn btn-primary" onClick={() => handleAction('ApprovePO')}><FaCheckCircle /> Approve</button>
          )}
          {isProcurementOfficer && po.status === 'Pending Approval' && canAccess('action', 'RejectPO') && (
            <button className="btn btn-outline" style={{ borderColor: 'var(--status-red)', color: 'var(--status-red)' }} onClick={() => handleAction('RejectPO')}><FaTimesCircle /> Reject</button>
          )}
          {isSupplier && po.status === 'Sent to Supplier' && canAccess('action', 'AcknowledgePO') && (
            <button className="btn btn-primary" onClick={() => handleAction('AcknowledgePO')}><FaCheckCircle /> Acknowledge PO</button>
          )}
          {isProcurementOfficer && (po.status === 'Acknowledged' || po.status === 'Partially Fulfilled') && canAccess('action', 'MarkFulfilled') && (
              <button className="btn btn-secondary" onClick={() => handleAction('MarkFulfilled')}><FaCheckCircle /> Mark Fulfilled</button>
          )}
          {isProcurementOfficer && po.status === 'Fulfilled' && canAccess('action', 'ClosePO') && (
              <button className="btn btn-primary" onClick={() => handleAction('ClosePO')}><FaTimesCircle /> Close PO</button>
          )}
          {po.rfqId && (canAccess('rfq', dummyRFQs.find(r => r.id === po.rfqId), 'view')) && (
            <button className="btn btn-text" onClick={() => handleAction('ViewRFQ')}><FaClipboardList /> View RFQ</button>
          )}
        </div>
      </div>

      <WorkflowTracker workflowHistory={po.workflowHistory} currentStatus={po.status} stagesConfig={poWorkflowStages} />

      <div className="detail-section">
        <h3>Purchase Order Details</h3>
        <div className="detail-grid">
          <div className="detail-item"><label>ID:</label><span>{po.id}</span></div>
          <div className="detail-item"><label>Title:</label><span>{po.title}</span></div>
          <div className="detail-item"><label>Status:</label><span className={`status-badge ${getStatusColorClass(po.status)}`}>{po.status}</span></div>
          <div className="detail-item"><label>Supplier:</label><span>{po.supplierName}</span></div>
          <div className="detail-item"><label>Amount:</label><span>${po.amount?.toLocaleString()}</span></div>
          <div className="detail-item"><label>Order Date:</label><span>{po.orderDate}</span></div>
          <div className="detail-item"><label>Delivery Date:</label><span>{po.deliveryDate}</span></div>
          <div className="detail-item"><label>Payment Terms:</label><span>{po.paymentTerms}</span></div>
        </div>
        <div className="detail-item mt-md"><label>Description:</label><span>{po.description}</span></div>
      </div>

      {po.attachments && po.attachments.length > 0 && (
        <div className="detail-section">
          <h3>Documents</h3>
          <ul className="file-upload-list" style={{ boxShadow: 'none', border: 'none' }}>
            {po.attachments.map((file, index) => (
              <li key={index} className="file-upload-item">
                <span>{file.name}</span>
                <a href={file.url} target="_blank" rel="noopener noreferrer" className="btn btn-text"><FaDownload /> Preview</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


const PurchaseOrdersList = () => {
  const { currentUser, canAccess } = useContext(AuthContext);
  const { navigate } = useContext(NavigationContext);
  const { addNotification } = useContext(NotificationContext);

  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPOs = dummyPOs.filter(po => {
    const userCanView = canAccess('po', po, 'view');
    if (!userCanView) return false;

    const matchesStatus = filterStatus === 'All' || po.status === filterStatus;
    const matchesSearch = po.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          po.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          po.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const uniqueStatuses = ['All', ...new Set(dummyPOs.map(po => po.status))];

  const handleCreatePO = () => {
    if (canAccess('action', 'CreatePO')) {
        navigate('POForm', { mode: 'create' });
    } else {
        addNotification('You do not have permission to create a Purchase Order.', 'error', 'Permission Denied');
    }
  };


  return (
    <div className="main-content">
      <h1>Purchase Orders</h1>

      <div className="data-grid-toolbar">
        <input
          type="text"
          placeholder="Search Purchase Orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="data-grid-filters">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="btn">
            {uniqueStatuses.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
        <div className="ml-auto">
          {canAccess('action', 'CreatePO') && (
            <button className="btn btn-primary" onClick={handleCreatePO}>
              <FaPlus /> Create New PO
            </button>
          )}
        </div>
      </div>

      {filteredPOs.length > 0 ? (
        <div className="card-grid">
          {filteredPOs.map(po => (
            <CardComponent
              key={po.id}
              title={po.title}
              status={po.status}
              onClick={() => navigate('PurchaseOrderDetail', { poId: po.id })}
              details={{
                'ID': po.id,
                'Supplier': po.supplierName,
                'Amount': `$${po.amount?.toLocaleString()}`,
                'Delivery Date': po.deliveryDate
              }}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <FaFileInvoiceDollar className="icon" />
          <h3>No Purchase Orders match your criteria.</h3>
          <p>It looks like there are no Purchase Orders to display right now, or your filters are too restrictive.</p>
          {canAccess('action', 'CreatePO') && (
            <button className="btn btn-primary mt-md" onClick={handleCreatePO}>
              <FaPlus /> Create Your First PO
            </button>
          )}
        </div>
      )}
    </div>
  );
};


const SupplierOnboardingDetail = ({ supplierId }) => {
  const { currentUser, canAccess } = useContext(AuthContext);
  const { goBack, navigate } = useContext(NavigationContext);
  const { addNotification } = useContext(NotificationContext);

  const supplier = dummySuppliers.find(s => s.id === supplierId);

  if (!supplier || !canAccess('supplier', supplier, 'view')) {
    addNotification('Supplier not found or you do not have permission to view it.', 'error', 'Permission Denied');
    return (
      <div className="full-screen-page">
        <button className="btn btn-outline mb-md" onClick={goBack}><FaArrowLeft /> Back</button>
        <p>Access Denied or Supplier Not Found.</p>
      </div>
    );
  }

  const isProcurementOfficer = currentUser.role === 'Procurement Officer';
  const isSelfSupplier = currentUser.role === 'Supplier' && currentUser.id === supplier.id;

  const supplierWorkflowStages = [
    { status: 'New', label: 'New', icon: <FaLightbulb /> },
    { status: 'Pending Review', label: 'Pending Review', icon: <FaHourglassHalf /> },
    { status: 'Approved', label: 'Approved', icon: <FaCheckCircle /> },
    { status: 'Rejected', label: 'Rejected', icon: <FaTimesCircle /> },
  ];

  const handleAction = (action) => {
    if (!canAccess('action', action)) {
        addNotification('You do not have permission for this action.', 'error', 'Permission Denied');
        return;
    }
    let message = '';
    switch (action) {
        case 'EditSupplier':
            // For now, no specific supplier form for update, just notification
            addNotification('Editing supplier details is not implemented in this prototype.', 'info', 'Feature Coming Soon');
            return;
        case 'ApproveSupplier':
            supplier.status = 'Approved';
            addNotification(`Supplier ${supplier.name} approved!`, 'success');
            break;
        case 'RejectSupplier':
            supplier.status = 'Rejected';
            addNotification(`Supplier ${supplier.name} rejected.`, 'info');
            break;
        case 'ManageCatalog':
            addNotification('Manage Catalog feature is not implemented in this prototype.', 'info', 'Feature Coming Soon');
            return;
        default:
            message = `Action "${action}" performed for Supplier ${supplier.id}.`;
    }
    dummySuppliers = [...dummySuppliers]; // Trigger re-render
    navigate('SupplierOnboardingDetail', { supplierId: supplier.id });
  };


  return (
    <div className="full-screen-page">
      <div className="breadcrumb">
        <a onClick={goBack}>Suppliers</a><span>/</span><span>{supplier.name}</span>
      </div>
      <div className="full-screen-header">
        <div className="flex items-center gap-md">
          <button className="btn btn-outline" onClick={goBack}><FaArrowLeft /> Back</button>
          <h1>Supplier: {supplier.name}</h1>
        </div>
        <div className="full-screen-actions">
          {(isProcurementOfficer || isSelfSupplier) && (supplier.status === 'New' || supplier.status === 'Pending Review') && canAccess('supplier', supplier, 'edit') && (
            <button className="btn btn-secondary" onClick={() => handleAction('EditSupplier')}><FaEdit /> Edit Profile</button>
          )}
          {isProcurementOfficer && supplier.status === 'Pending Review' && canAccess('action', 'ApproveSupplier') && (
            <button className="btn btn-primary" onClick={() => handleAction('ApproveSupplier')}><FaCheckCircle /> Approve</button>
          )}
          {isProcurementOfficer && supplier.status === 'Pending Review' && canAccess('action', 'RejectSupplier') && (
            <button className="btn btn-outline" style={{ borderColor: 'var(--status-red)', color: 'var(--status-red)' }} onClick={() => handleAction('RejectSupplier')}><FaTimesCircle /> Reject</button>
          )}
          {isSelfSupplier && supplier.status === 'Approved' && canAccess('action', 'ManageCatalog') && (
            <button className="btn btn-primary" onClick={() => handleAction('ManageCatalog')}><FaBoxOpen /> Manage Catalog</button>
          )}
        </div>
      </div>

      <WorkflowTracker workflowHistory={[{ stage: supplier.status, by: 'System', date: supplier.onboardingDate }]} currentStatus={supplier.status} stagesConfig={supplierWorkflowStages} />


      <div className="detail-section">
        <h3>Supplier Information</h3>
        <div className="detail-grid">
          <div className="detail-item"><label>ID:</label><span>{supplier.id}</span></div>
          <div className="detail-item"><label>Name:</label><span>{supplier.name}</span></div>
          <div className="detail-item"><label>Status:</label><span className={`status-badge ${getStatusColorClass(supplier.status)}`}>{supplier.status}</span></div>
          <div className="detail-item"><label>Contact Person:</label><span>{supplier.contactPerson}</span></div>
          <div className="detail-item"><label>Email:</label><span>{supplier.email}</span></div>
          <div className="detail-item"><label>Phone:</label><span>{supplier.phone}</span></div>
          <div className="detail-item"><label>Category:</label><span>{supplier.category}</span></div>
          <div className="detail-item"><label>Onboarding Date:</label><span>{supplier.onboardingDate}</span></div>
        </div>
        <div className="detail-item mt-md"><label>Address:</label><span>{supplier.address}</span></div>
      </div>

      {supplier.documents && supplier.documents.length > 0 && (
        <div className="detail-section">
          <h3>Documents</h3>
          <ul className="file-upload-list" style={{ boxShadow: 'none', border: 'none' }}>
            {supplier.documents.map((file, index) => (
              <li key={index} className="file-upload-item">
                <span>{file.name}</span>
                <a href={file.url} target="_blank" rel="noopener noreferrer" className="btn btn-text"><FaDownload /> Preview</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


const SupplierOnboardingList = () => {
  const { currentUser, canAccess } = useContext(AuthContext);
  const { navigate } = useContext(NavigationContext);
  const { addNotification } = useContext(NotificationContext);

  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSuppliers = dummySuppliers.filter(supplier => {
    const userCanView = canAccess('supplier', supplier, 'view');
    if (!userCanView) return false;

    const matchesStatus = filterStatus === 'All' || supplier.status === filterStatus;
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          supplier.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const uniqueStatuses = ['All', ...new Set(dummySuppliers.map(s => s.status))];

  return (
    <div className="main-content">
      <h1>Supplier Management</h1>

      <div className="data-grid-toolbar">
        <input
          type="text"
          placeholder="Search Suppliers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="data-grid-filters">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="btn">
            {uniqueStatuses.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
        {currentUser.role === 'Supplier' && (
             <div className="ml-auto">
                <button className="btn btn-primary" onClick={() => addNotification('Self-onboarding is coming soon!', 'info', 'Feature Notice')}>
                    <FaPlus /> Self-Onboard
                </button>
             </div>
        )}
      </div>

      {filteredSuppliers.length > 0 ? (
        <div className="card-grid">
          {filteredSuppliers.map(supplier => (
            <CardComponent
              key={supplier.id}
              title={supplier.name}
              status={supplier.status}
              onClick={() => navigate('SupplierOnboardingDetail', { supplierId: supplier.id })}
              details={{
                'ID': supplier.id,
                'Contact': supplier.contactPerson,
                'Category': supplier.category,
                'Onboard Date': supplier.onboardingDate
              }}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <FaUsers className="icon" />
          <h3>No Suppliers match your criteria.</h3>
          <p>It looks like there are no suppliers to display right now, or your filters are too restrictive.</p>
        </div>
      )}
    </div>
  );
};


const AuditLogsScreen = () => {
  const { currentUser, canAccess } = useContext(AuthContext);
  const { addNotification } = useContext(NotificationContext);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  if (!canAccess('AuditLogsScreen')) {
    addNotification('You do not have permission to view Audit Logs.', 'error', 'Permission Denied');
    return (
      <div className="full-screen-page">
        <p>Access Denied.</p>
      </div>
    );
  }

  const filteredLogs = dummyAuditLogs.filter(log => {
    const userCanView = canAccess('auditLog', log, 'view');
    if (!userCanView) return false;

    const matchesSearch = log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.entityId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || log.entityType === filterType;
    return matchesSearch && matchesType;
  });

  const sortedLogs = [...filteredLogs].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (sortBy === 'timestamp') {
      return sortOrder === 'asc' ? new Date(aValue) - new Date(bValue) : new Date(bValue) - new Date(aValue);
    }
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    return 0;
  });

  const uniqueEntityTypes = ['All', ...new Set(dummyAuditLogs.map(log => log.entityType))];

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (column) => {
    if (sortBy === column) {
      return sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />;
    }
    return null;
  };

  return (
    <div className="main-content">
      <h1>Audit Logs</h1>

      <div className="data-grid-toolbar">
        <input
          type="text"
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="data-grid-filters">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="btn">
            {uniqueEntityTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
      </div>

      {sortedLogs.length > 0 ? (
        <div className="data-grid-container">
          <table className="audit-log-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('timestamp')}>Timestamp {getSortIcon('timestamp')}</th>
                <th onClick={() => handleSort('actor')}>Actor {getSortIcon('actor')}</th>
                <th onClick={() => handleSort('action')}>Action {getSortIcon('action')}</th>
                <th onClick={() => handleSort('entityType')}>Entity Type {getSortIcon('entityType')}</th>
                <th onClick={() => handleSort('entityId')}>Entity ID {getSortIcon('entityId')}</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {sortedLogs.map(log => (
                <tr key={log.id}>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                  <td>{log.actor}</td>
                  <td>{log.action}</td>
                  <td>{log.entityType}</td>
                  <td>{log.entityId}</td>
                  <td>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <FaHistory className="icon" />
          <h3>No Audit Logs match your criteria.</h3>
          <p>It looks like there are no audit logs to display right now, or your filters are too restrictive.</p>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const { currentUser, canAccess } = useContext(AuthContext);
  const { navigate } = useContext(NavigationContext);
  const { addNotification } = useContext(NotificationContext);

  if (!canAccess('Dashboard')) {
    addNotification('You do not have permission to view the Dashboard.', 'error', 'Permission Denied');
    return (
      <div className="main-content">
        <p>Access Denied.</p>
      </div>
    );
  }

  const isBusinessUser = currentUser.role === 'Business User';
  const isProcurementOfficer = currentUser.role === 'Procurement Officer';
  const isSupplier = currentUser.role === 'Supplier';

  // --- KPI Calculations (RBAC-aware) ---
  const myRfqs = dummyRFQs.filter(rfq => canAccess('rfq', rfq, 'view') && rfq.initiatorId === currentUser.id);
  const pendingRfqs = myRfqs.filter(rfq => rfq.status === 'Pending Approval');
  const openRfqs = myRfqs.filter(rfq => rfq.status === 'Open');
  const totalSpend = myRfqs.reduce((sum, rfq) => sum + rfq.budget, 0);

  const allVisibleRfqs = dummyRFQs.filter(rfq => canAccess('rfq', rfq, 'view'));
  const allVisiblePOs = dummyPOs.filter(po => canAccess('po', po, 'view'));
  const allVisibleSuppliers = dummySuppliers.filter(s => canAccess('supplier', s, 'view'));

  const rfqsInApproval = allVisibleRfqs.filter(rfq => rfq.status === 'Pending Approval');
  const suppliersOnboarded = allVisibleSuppliers.filter(s => s.status === 'Approved');
  const totalSpendManaged = allVisiblePOs.reduce((sum, po) => sum + po.amount, 0);

  const rfqsToRespond = dummyRFQs.filter(rfq => canAccess('rfq', rfq, 'respond') && rfq.status === 'Open' && rfq.assignedSuppliers.includes(currentUser.id));
  const awardedRfqsForSupplier = dummyRFQs.filter(rfq => rfq.status === 'Awarded' && rfq.quotes.some(q => q.supplierId === currentUser.id && q.status === 'Awarded'));
  const totalAwardValue = awardedRfqsForSupplier.reduce((sum, rfq) => sum + (rfq.quotes.find(q => q.supplierId === currentUser.id && q.status === 'Awarded')?.amount || 0), 0);

  const kpis = [];

  if (isBusinessUser) {
    kpis.push(
      { id: 1, title: 'My Pending RFQs', value: pendingRfqs.length, unit: '', trend: '+2%', icon: <FaHourglassHalf />, color: 'var(--status-orange)' },
      { id: 2, title: 'My Open RFQs', value: openRfqs.length, unit: '', trend: '+5%', icon: <FaBoxOpen />, color: 'var(--status-blue)' },
      { id: 3, title: 'Total Spend (My Requests)', value: totalSpend, unit: '$', trend: '-1%', icon: <FaDollarSign />, color: 'var(--status-green)' },
    );
  }

  if (isProcurementOfficer) {
    kpis.push(
      { id: 4, title: 'Total RFQs', value: allVisibleRfqs.length, unit: '', trend: '+10%', icon: <FaClipboardList />, color: 'var(--primary-color)' },
      { id: 5, title: 'RFQs in Approval', value: rfqsInApproval.length, unit: '', trend: '+1%', icon: <FaHourglassHalf />, color: 'var(--status-orange)' },
      { id: 6, title: 'Suppliers Onboarded', value: suppliersOnboarded.length, unit: '', trend: '+3%', icon: <FaUsers />, color: 'var(--status-blue)' },
      { id: 7, title: 'Total Spend Managed', value: totalSpendManaged, unit: '$', trend: '+7%', icon: <FaDollarSign />, color: 'var(--status-green)' },
    );
  }

  if (isSupplier) {
    kpis.push(
      { id: 8, title: 'RFQs To Respond', value: rfqsToRespond.length, unit: '', trend: '-10%', icon: <FaEdit />, color: 'var(--status-orange)' },
      { id: 9, title: 'Awarded RFQs', value: awardedRfqsForSupplier.length, unit: '', trend: '+20%', icon: <FaAward />, color: 'var(--status-yellow)' },
      { id: 10, title: 'Total Award Value', value: totalAwardValue, unit: '$', trend: '+15%', icon: <FaDollarSign />, color: 'var(--status-green)' },
    );
  }

  // --- Recent Activities (RBAC-aware) ---
  const recentActivities = dummyAuditLogs.filter(log => canAccess('auditLog', log, 'view'))
                                        .slice(0, 5) // Show top 5 recent activities
                                        .map(log => ({
                                            id: log.id,
                                            title: `${log.actor} ${log.action} ${log.entityType} ${log.entityId}`,
                                            description: log.details,
                                            date: new Date(log.timestamp).toLocaleString(),
                                            status: log.action.includes('Approved') ? 'Approved' : log.action.includes('Rejected') ? 'Rejected' : 'In Progress'
                                        }));


  // --- Drill-down logic for charts ---
  const handleChartDrilldown = (chartType, data) => {
    addNotification(`Drill-down on ${chartType} for: ${JSON.stringify(data)}`, 'info', 'Chart Click');
    // In a real app, this would navigate to a detailed report or filtered list
    if (chartType === 'RFQ Status Breakdown') {
        navigate('RFQsList', { filterStatus: data.status }); // Example: navigate to RFQ list filtered by status
    }
  };

  return (
    <div className="main-content">
      <h1 className="chart-live-pulse" style={{ marginBottom: 'var(--spacing-md)' }}>
        {currentUser.role} Dashboard <FaChartLine />
      </h1>

      <div className="dashboard-grid">
        {kpis.map(kpi => (
          <div key={kpi.id} className="kpi-card" style={{ borderLeftColor: kpi.color }}>
            <h4>{kpi.title}</h4>
            <div className="kpi-value chart-live-pulse">
              {kpi.unit}{kpi.value.toLocaleString()}
            </div>
            <div className="kpi-trend">
              {kpi.icon} {kpi.trend} vs. last month
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid" style={{ marginTop: 'var(--spacing-xl)' }}>
        <div className="chart-card">
          <h4>RFQ Status Breakdown</h4>
          <div className="chart-placeholder chart-live-pulse" onClick={() => handleChartDrilldown('RFQ Status Breakdown', { status: 'Open' })}>
            Donut Chart (Click for details)
          </div>
        </div>
        <div className="chart-card">
          <h4>Spend by Category</h4>
          <div className="chart-placeholder chart-live-pulse" onClick={() => handleChartDrilldown('Spend by Category', { category: 'IT Services' })}>
            Bar Chart (Click for details)
          </div>
        </div>
        {(isProcurementOfficer || isBusinessUser) && (
            <div className="chart-card">
              <h4>Average RFQ Cycle Time (Days)</h4>
              <div className="chart-placeholder chart-live-pulse" onClick={() => handleChartDrilldown('Average RFQ Cycle Time', { period: 'Last 30 Days' })}>
                Gauge Chart (Click for details)
              </div>
            </div>
        )}
         {(isProcurementOfficer || isBusinessUser) && (
            <div className="chart-card">
              <h4>SLA Breach Trends</h4>
              <div className="chart-placeholder chart-live-pulse" onClick={() => handleChartDrilldown('SLA Breach Trends', { type: 'Late Approvals' })}>
                Line Chart (Click for details)
              </div>
            </div>
        )}
      </div>

      <div className="detail-section" style={{ marginTop: 'var(--spacing-xl)' }}>
          <h3>Recent Activities</h3>
          <div className="data-grid-container" style={{ padding: '0', boxShadow: 'none' }}>
            <table className="data-grid-table" style={{ borderBottom: 'none' }}>
                <thead>
                    <tr>
                        <th>Activity</th>
                        <th>Details</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {recentActivities.map(activity => (
                        <tr key={activity.id}>
                            <td>{activity.title}</td>
                            <td>{activity.description}</td>
                            <td>{activity.date}</td>
                            <td><span className={`status-badge ${getStatusColorClass(activity.status)}`}>{activity.status}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
      </div>
    </div>
  );
};


// --- App Component (Main Router) ---
const AppContent = () => {
  const { currentScreen, goBack, screenHistory } = useContext(NavigationContext);
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <LoginScreen />;
  }

  // Determine the component to render based on currentScreen.name
  let ComponentToRender = null;
  const screenProps = currentScreen.data || {};

  switch (currentScreen.name) {
    case 'Dashboard':
      ComponentToRender = Dashboard;
      break;
    case 'RFQsList':
      ComponentToRender = RFQsList;
      break;
    case 'RFQDetail':
      ComponentToRender = RFQDetail;
      break;
    case 'RFQForm':
      ComponentToRender = RFQForm;
      break;
    case 'PurchaseOrdersList':
      ComponentToRender = PurchaseOrdersList;
      break;
    case 'PurchaseOrderDetail':
      ComponentToRender = PurchaseOrderDetail;
      break;
    case 'POForm':
      ComponentToRender = POForm;
      break;
    case 'SupplierOnboardingList':
      ComponentToRender = SupplierOnboardingList;
      break;
    case 'SupplierOnboardingDetail':
      ComponentToRender = SupplierOnboardingDetail;
      break;
    case 'SupplierResponseForm':
      ComponentToRender = SupplierResponseForm;
      break;
    case 'AuditLogsScreen':
        ComponentToRender = AuditLogsScreen;
        break;
    default:
      ComponentToRender = () => (
        <div className="main-content">
          <h1>404 - Screen Not Found</h1>
          <p>The requested screen "{currentScreen.name}" does not exist or is not configured.</p>
          <button className="btn btn-primary" onClick={goBack}>Go Back</button>
        </div>
      );
  }

  // Render main layout for authenticated users
  return (
    <div className="app-container">
      <Sidebar />
      <div className="full-screen-page"> {/* All main content pages will be full-screen */}
        {ComponentToRender && <ComponentToRender {...screenProps} />}
      </div>
    </div>
  );
};

export const App = () => (
  <NotificationProvider>
    <AuthProvider>
      <NavigationProvider>
        <Header />
        <AppContent />
      </NavigationProvider>
    </AuthProvider>
  </NotificationProvider>
);
