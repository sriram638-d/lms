/*
           MODULE 7: ADMIN PORTAL VIEWS (js/admin.js)
           ========================================================================== */
        function renderAdminPortalView(admin, db) {
            const students = db.users.filter(u => u.role === 'student');
            const facultyList = db.users.filter(u => u.role === 'faculty');

            switch (appState.activeTab) {
                case 'dashboard': {
                    return `
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-info">
                                <h4>Total Students</h4>
                                <div class="stat-num">${students.length}</div>
                            </div>
                            <div class="stat-icon blue"><i class="fa-solid fa-user-graduate"></i></div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-info">
                                <h4>Total Faculty</h4>
                                <div class="stat-num">${facultyList.length}</div>
                            </div>
                            <div class="stat-icon green"><i class="fa-solid fa-chalkboard-user"></i></div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-info">
                                <h4>Active Courses</h4>
                                <div class="stat-num">${db.courses.length}</div>
                            </div>
                            <div class="stat-icon amber"><i class="fa-solid fa-book"></i></div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-info">
                                <h4>Total Submissions</h4>
                                <div class="stat-num">${db.submissions.length}</div>
                            </div>
                            <div class="stat-icon blue"><i class="fa-solid fa-file-Arrow-up"></i></div>
                        </div>
                    </div>

                    <div class="grid-2col">
                        <div class="card">
                            <div class="card-header">
                                <div class="card-title"><i class="fa-solid fa-chart-bar"></i> Course Enrollment Distribution (HTML/CSS Bar Chart)</div>
                            </div>
                            <div class="css-bar-chart">
                                ${db.courses.map(c => {
                                    const enrolledCount = students.filter(s => (s.enrolledCourses || []).includes(c.id)).length;
                                    const pct = students.length > 0 ? Math.round((enrolledCount / students.length) * 100) : 0;
                                    return `
                                    <div class="chart-row">
                                        <div class="chart-label" title="${escapeHTML(c.title)}">${escapeHTML(c.code)}</div>
                                        <div class="progress-wrapper" style="height:12px;">
                                            <div class="progress-fill" style="width:${Math.max(pct, 12)}%;"></div>
                                        </div>
                                        <div class="chart-value">${enrolledCount} Stu</div>
                                    </div>`;
                                }).join('')}
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-title"><i class="fa-solid fa-shield-halved"></i> Administrative Shortcuts</div>
                            </div>
                            <div style="display:flex;flex-direction:column;gap:10px;">
                                <button class="btn btn-primary" onclick="switchPortalTab('users')">
                                    <i class="fa-solid fa-user-plus"></i> Manage Student &amp; Faculty Accounts
                                </button>
                                <button class="btn btn-secondary" onclick="switchPortalTab('courses')">
                                    <i class="fa-solid fa-folder-plus"></i> Create New Institutional Course
                                </button>
                                <button class="btn btn-secondary" onclick="switchPortalTab('registration')"><i class="fa-solid fa-clipboard-list"></i> Registration Controls</button>
                                <button class="btn btn-secondary" onclick="switchPortalTab('quiz-control')"><i class="fa-solid fa-stopwatch"></i> Institution Quiz Controls</button>
                                <button class="btn btn-secondary" onclick="switchPortalTab('reports')">
                                    <i class="fa-solid fa-print"></i> View &amp; Print Academic Reports
                                </button>
                                <button class="btn btn-danger" onclick="confirmResetDemoData()">
                                    <i class="fa-solid fa-rotate-right"></i> Reset All LocalStorage Data
                                </button>
                            </div>
                        </div>
                    </div>`;
                }

                case 'users': {
                    return `
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fa-solid fa-user-plus"></i> Register New Student or Faculty Account</div>
                        </div>
                        <form onsubmit="handleAdminCreateUser(event)">
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">User ID *</label>
                                    <input type="text" id="adm-uid" class="form-control" placeholder="e.g., STU109 or FAC205" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Full Name *</label>
                                    <input type="text" id="adm-uname" class="form-control" placeholder="Full Name" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Role *</label>
                                    <select id="adm-urole" class="form-control">
                                        <option value="student">Student</option>
                                        <option value="faculty">Faculty</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Official Email *</label>
                                    <input type="email" id="adm-uemail" class="form-control" placeholder="user@college.edu" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Department *</label>
                                    <input type="text" id="adm-udept" class="form-control" value="Computer Science (CSE)" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Semester (student)</label>
                                    <select id="adm-semester" class="form-control"><option>1st Semester</option><option>2nd Semester</option><option>3rd Semester</option><option>4th Semester</option><option>5th Semester</option><option>6th Semester</option><option>7th Semester</option><option>8th Semester</option></select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Academic Year</label>
                                    <input type="text" id="adm-year" class="form-control" value="2026-2027">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Default Password *</label>
                                    <input type="text" id="adm-upass" class="form-control" value="password123" required>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary">Create User Account</button>
                        </form>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fa-solid fa-users-gear"></i> All Registered Portal Users</div>
                        </div>
                        <div class="table-responsive">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Department</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${db.users.map(u => `
                                        <tr>
                                            <td><strong>${escapeHTML(u.id)}</strong></td>
                                            <td>${escapeHTML(u.name)}</td>
                                            <td>${escapeHTML(u.email)}</td>
                                            <td><span class="badge ${u.role === 'admin' ? 'badge-danger' : (u.role === 'faculty' ? 'badge-primary' : 'badge-neutral')}">${escapeHTML(u.role.toUpperCase())}</span></td>
                                            <td>${escapeHTML(u.department || '')}</td>
                                            <td><span class="badge ${u.status === 'Active' ? 'badge-success' : 'badge-warning'}">${escapeHTML(u.status)}</span></td>
                                            <td>
                                                ${u.role !== 'admin' ? `
                                                    <button class="btn btn-secondary btn-sm" onclick="toggleUserStatus('${u.id}')">
                                                        ${u.status === 'Active' ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                    <button class="btn btn-danger btn-sm" onclick="deleteUserAccount('${u.id}')">
                                                        <i class="fa-solid fa-trash"></i>
                                                    </button>
                                                ` : '<span style="font-size:12px;color:var(--text-secondary);">Protected</span>'}
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>`;
                }

                case 'courses': {
                    return `
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fa-solid fa-plus"></i> Add New Institutional Course</div>
                        </div>
                        <form onsubmit="handleAdminCreateCourse(event)">
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Course Code *</label>
                                    <input type="text" id="ac-code" class="form-control" placeholder="e.g., CS-305" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Course Title *</label>
                                    <input type="text" id="ac-title" class="form-control" placeholder="e.g., Computer Networks" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Assign Faculty *</label>
                                    <select id="ac-faculty" class="form-control">
                                        ${facultyList.map(f => `<option value="${f.id}">${escapeHTML(f.name)} (${escapeHTML(f.department)})</option>`).join('')}
                                    </select>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Department</label>
                                    <input type="text" id="ac-dept" class="form-control" value="Computer Science (CSE)" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Semester</label>
                                    <input type="text" id="ac-sem" class="form-control" value="6th Semester" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Academic Year</label>
                                    <input type="text" id="ac-year" class="form-control" value="2026-2027" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Credits</label>
                                    <input type="number" id="ac-credits" class="form-control" value="4" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Course Description</label>
                                <input type="text" id="ac-desc" class="form-control" placeholder="Overview of course objectives..." required>
                            </div>
                            <button type="submit" class="btn btn-primary">Create Course</button>
                        </form>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fa-solid fa-book-bookmark"></i> Master Course Catalog</div>
                        </div>
                        <div class="table-responsive">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Code</th>
                                        <th>Title</th>
                                        <th>Department</th>
                                        <th>Assigned Faculty</th>
                                        <th>Modules</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${db.courses.map(c => `
                                        <tr>
                                            <td>${escapeHTML(c.id)}</td>
                                            <td><span class="badge badge-primary">${escapeHTML(c.code)}</span></td>
                                            <td style="font-weight:600;">${escapeHTML(c.title)}</td>
                                            <td>${escapeHTML(c.department)}</td>
                                            <td>${escapeHTML(c.facultyName)}</td>
                                            <td>${c.modules.length}</td>
                                            <td>
                                                <button class="btn btn-danger btn-sm" onclick="adminDeleteCourse('${c.id}')">
                                                    <i class="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>`;
                }

                case 'semesters': {
                    const sems = db.semesters || [];
                    return `<div class="card"><div class="card-header"><div class="card-title"><i class="fa-solid fa-calendar"></i> Academic Semester Setup</div></div>
                    <form onsubmit="adminAddSemester(event)"><div class="form-row"><div class="form-group"><label class="form-label">Semester</label><select class="form-control" id="sem-name"><option>1st Semester</option><option>2nd Semester</option><option>3rd Semester</option><option>4th Semester</option><option>5th Semester</option><option>6th Semester</option><option>7th Semester</option><option>8th Semester</option></select></div><div class="form-group"><label class="form-label">Academic Year</label><input class="form-control" id="sem-year" placeholder="2026-2027" required></div><div class="form-group"><label class="form-label">Department</label><input class="form-control" id="sem-dept" placeholder="CSE" required></div></div><button class="btn btn-primary" type="submit">Add Semester Configuration</button></form></div>
                    <div class="card"><div class="card-header"><div class="card-title">Configured Semester Groups</div></div><div class="table-responsive"><table class="data-table"><thead><tr><th>Semester</th><th>Academic Year</th><th>Department</th><th>Students</th><th>Courses</th></tr></thead><tbody>${sems.length?sems.map(x=>`<tr><td>${escapeHTML(x.semester)}</td><td>${escapeHTML(x.year)}</td><td>${escapeHTML(x.department)}</td><td>${students.filter(st=>st.semester===x.semester && st.academicYear===x.year && st.department===x.department).length}</td><td>${db.courses.filter(c=>c.semester===x.semester && c.academicYear===x.year && c.department===x.department).length}</td></tr>`).join(''):`<tr><td colspan="5">No semester configurations yet.</td></tr>`}</tbody></table></div></div>`;
                }
                case 'registration': {
                    return `<div class="card"><div class="card-header"><div class="card-title"><i class="fa-solid fa-clipboard-list"></i> Registration Settings</div></div><form onsubmit="adminSaveRegistrationSettings(event)"><div class="form-row"><div class="form-group"><label class="form-label">Registration</label><select class="form-control" id="reg-open"><option value="true" ${(db.settings.allowRegistration!==false)?'selected':''}>Open</option><option value="false" ${(db.settings.allowRegistration===false)?'selected':''}>Closed</option></select></div><div class="form-group"><label class="form-label">Academic Year</label><input class="form-control" id="reg-year" value="${escapeHTML(db.settings.academicYear||'')}" required></div></div><button class="btn btn-primary">Save Registration Settings</button></form></div>
                    <div class="card"><div class="card-header"><div class="card-title">Course Eligibility Overview</div></div><div class="table-responsive"><table class="data-table"><thead><tr><th>Course</th><th>Department</th><th>Semester</th><th>Academic Year</th><th>Enrolled</th></tr></thead><tbody>${db.courses.map(c=>`<tr><td>${escapeHTML(c.title)} (${escapeHTML(c.code)})</td><td>${escapeHTML(c.department||'')}</td><td>${escapeHTML(c.semester||'Not set')}</td><td>${escapeHTML(c.academicYear||db.settings.academicYear||'')}</td><td>${students.filter(st=>(st.enrolledCourses||[]).includes(c.id)).length}</td></tr>`).join('')}</tbody></table></div></div>`;
                }
                case 'quiz-control': {
                    return `<div class="card"><div class="card-header"><div class="card-title"><i class="fa-solid fa-stopwatch"></i> Institution-wide Quiz Control</div></div><div class="table-responsive"><table class="data-table"><thead><tr><th>Quiz</th><th>Course</th><th>Duration</th><th>Status</th><th>Action</th></tr></thead><tbody>${db.quizzes.map(q=>{const c=db.courses.find(x=>x.id===q.courseId);const stopped=q.status==='Stopped';return `<tr><td>${escapeHTML(q.title)}</td><td>${escapeHTML(c?c.code:q.courseId)}</td><td>${q.durationMinutes} min</td><td><span class="badge ${stopped?'badge-warning':'badge-success'}">${stopped?'Stopped':'Open'}</span></td><td><button class="btn ${stopped?'btn-primary':'btn-danger'} btn-sm" onclick="adminToggleQuiz('${q.id}')">${stopped?'Reopen':'Stop'}</button></td></tr>`}).join('')||'<tr><td colspan="5">No quizzes available.</td></tr>'}</tbody></table></div></div>`;
                }
                case 'announcements': {
                    const anns=db.announcements||[];
                    return `<div class="card"><div class="card-header"><div class="card-title"><i class="fa-solid fa-bullhorn"></i> Create Institutional Announcement</div></div><form onsubmit="adminCreateAnnouncement(event)"><div class="form-row"><div class="form-group"><label class="form-label">Title</label><input class="form-control" id="ann-title" required></div><div class="form-group"><label class="form-label">Audience</label><select class="form-control" id="ann-audience"><option>Everyone</option><option>Students</option><option>Faculty</option></select></div></div><div class="form-group"><label class="form-label">Message</label><textarea class="form-control" id="ann-message" rows="3" required></textarea></div><button class="btn btn-primary">Publish Announcement</button></form></div><div class="card"><div class="card-header"><div class="card-title">Announcements</div></div>${anns.map(a=>`<div style="padding:12px;border-bottom:1px solid var(--border-color,#ddd)"><strong>${escapeHTML(a.title||'Announcement')}</strong><div>${escapeHTML(a.message||a.content||'')}</div><small>${escapeHTML(a.audience||'Everyone')} · ${escapeHTML(a.date||'')}</small></div>`).join('')||'<p>No announcements posted.</p>'}</div>`;
                }
                case 'audit': {
                    const logs=db.auditLogs||[];
                    return `<div class="card"><div class="card-header"><div class="card-title"><i class="fa-solid fa-history"></i> Administrative Activity Log</div><button class="btn btn-secondary btn-sm" onclick="adminExportAuditLog()">Export CSV</button></div><div class="table-responsive"><table class="data-table"><thead><tr><th>Action</th><th>Details</th><th>Timestamp</th></tr></thead><tbody>${logs.slice().reverse().map(l=>`<tr><td>${escapeHTML(l.action)}</td><td>${escapeHTML(l.details)}</td><td>${escapeHTML(l.timestamp)}</td></tr>`).join('')||'<tr><td colspan="3">No activity recorded yet.</td></tr>'}</tbody></table></div></div>`;
                }
                case 'reports': {
                    return `
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fa-solid fa-file-contract"></i> Institutional Assessment &amp; Grading Summary</div>
                            <button class="btn btn-secondary btn-sm" onclick="window.print()">
                                <i class="fa-solid fa-print"></i> Print Report
                            </button>
                        </div>
                        <div class="table-responsive">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Student Name</th>
                                        <th>Roll ID</th>
                                        <th>Enrolled Courses</th>
                                        <th>Quizzes Completed</th>
                                        <th>Assignments Submitted</th>
                                        <th>Standing</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${students.map(s => {
                                        const qAtt = db.quizAttempts.filter(a => a.studentId === s.id);
                                        const subs = db.submissions.filter(sub => sub.studentId === s.id);
                                        return `
                                        <tr>
                                            <td style="font-weight:600;">${escapeHTML(s.name)}</td>
                                            <td>${escapeHTML(s.id)}</td>
                                            <td>${(s.enrolledCourses || []).length} Courses</td>
                                            <td>${qAtt.length} Quizzes</td>
                                            <td>${subs.length} Submissions</td>
                                            <td><span class="badge badge-success">Good Standing</span></td>
                                        </tr>`;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>`;
                }

                case 'settings': {
                    return `
                    <div class="card" style="max-width:680px;">
                        <div class="card-header">
                            <div class="card-title"><i class="fa-solid fa-sliders"></i> Portal Configuration &amp; Academic Session</div>
                        </div>
                        <form onsubmit="handleSaveSystemSettings(event)">
                            <div class="form-group">
                                <label class="form-label">Institution / College Name</label>
                                <input type="text" id="set-college" class="form-control" value="${escapeHTML(db.settings.collegeName)}" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Active Academic Session</label>
                                <input type="text" id="set-year" class="form-control" value="${escapeHTML(db.settings.academicYear)}" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Global Top Notification Banner</label>
                                <textarea id="set-banner" class="form-control" rows="2">${escapeHTML(db.settings.systemBanner)}</textarea>
                            </div>
                            <div style="display:flex;gap:12px;flex-wrap:wrap;">
                                <button type="submit" class="btn btn-primary">Save System Settings</button>
                                <button type="button" class="btn btn-danger" onclick="confirmResetDemoData()">
                                    Reset All LocalStorage Data to Defaults
                                </button>
                            </div>
                        </form>
                    </div>`;
                }
            }
            return '';
        }

        // Admin Action Handlers
        function handleAdminCreateUser(e) {
            e.preventDefault();
            const db = getDB();
            const id = document.getElementById('adm-uid').value.trim().toUpperCase();
            const name = document.getElementById('adm-uname').value.trim();
            const role = document.getElementById('adm-urole').value;
            const email = document.getElementById('adm-uemail').value.trim();
            const department = document.getElementById('adm-udept').value.trim();
            const password = document.getElementById('adm-upass').value;

            if (db.users.some(u => u.id === id || u.email.toLowerCase() === email.toLowerCase())) {
                showToast('User ID or Email already exists.', 'danger');
                return;
            }

            db.users.push({
                id,
                role,
                name,
                email,
                password,
                department,
                semester: role === 'student' ? document.getElementById('adm-semester').value : undefined,
                academicYear: role === 'student' ? document.getElementById('adm-year').value.trim() : undefined,
                status: 'Active',
                enrolledCourses: role === 'student' ? ['CS301'] : undefined
            });
            db.auditLogs=db.auditLogs||[];db.auditLogs.push({action:'User created',details:`${role}: ${id} (${name})`,timestamp:new Date().toLocaleString()});
            saveDB(db);
            showToast(`Created ${role} account for ${name}.`, 'success');
            renderApp();
        }

        function toggleUserStatus(userId) {
            const db = getDB();
            const u = db.users.find(item => item.id === userId);
            if (u) {
                u.status = u.status === 'Active' ? 'Inactive' : 'Active';
                saveDB(db);
                showToast(`Updated status for ${u.name} to ${u.status}.`, 'primary');
                renderApp();
            }
        }

        function deleteUserAccount(userId) {
            const db = getDB();
            db.users = db.users.filter(u => u.id !== userId);
            saveDB(db);
            showToast('User account deleted.', 'danger');
            renderApp();
        }

        function handleAdminCreateCourse(e) {
            e.preventDefault();
            const db = getDB();
            const code = document.getElementById('ac-code').value.trim().toUpperCase();
            const id = code.replace(/[^A-Z0-9]/g, '');
            const title = document.getElementById('ac-title').value.trim();
            const facultyId = document.getElementById('ac-faculty').value;
            const facObj = db.users.find(u => u.id === facultyId);

            db.courses.push({
                id,
                code,
                title,
                department: document.getElementById('ac-dept').value.trim(),
                semester: document.getElementById('ac-sem').value.trim(),
                academicYear: document.getElementById('ac-year').value.trim(),
                credits: parseInt(document.getElementById('ac-credits').value, 10) || 4,
                facultyId,
                facultyName: facObj ? facObj.name : 'Faculty Member',
                description: document.getElementById('ac-desc').value.trim(),
                modules: [
                    { id: 'M1', title: 'Unit 1: Course Foundations & Syllabus Overview', duration: '4 Hours', videoUrl: '#', notes: 'Introductory concepts and reference material.' }
                ]
            });
            db.auditLogs=db.auditLogs||[];db.auditLogs.push({action:'Course created',details:`${code} · ${title}`,timestamp:new Date().toLocaleString()});
            saveDB(db);
            showToast(`Course ${code} added to catalog.`, 'success');
            renderApp();
        }

        function adminDeleteCourse(courseId) {
            const db = getDB();
            db.courses = db.courses.filter(c => c.id !== courseId);
            saveDB(db);
            showToast('Course removed from catalog.', 'danger');
            renderApp();
        }

        function handleSaveSystemSettings(e) {
            e.preventDefault();
            const db = getDB();
            db.settings.collegeName = document.getElementById('set-college').value.trim();
            db.settings.academicYear = document.getElementById('set-year').value.trim();
            db.settings.systemBanner = document.getElementById('set-banner').value.trim();
            saveDB(db);
            showToast('System settings updated.', 'success');
            renderApp();
        }



        // Enhanced Admin Portal handlers (prototype/localStorage)
        function adminLog(action, details) {
            const db=getDB(); db.auditLogs=db.auditLogs||[];
            db.auditLogs.push({action,details,timestamp:new Date().toLocaleString()});
            saveDB(db);
        }
        function adminAddSemester(e){e.preventDefault();const db=getDB();db.semesters=db.semesters||[];const semester=document.getElementById('sem-name').value,year=document.getElementById('sem-year').value.trim(),department=document.getElementById('sem-dept').value.trim();if(db.semesters.some(x=>x.semester===semester&&x.year===year&&x.department===department)){showToast('This semester configuration already exists.','danger');return;}db.semesters.push({semester,year,department});db.auditLogs=db.auditLogs||[];db.auditLogs.push({action:'Semester configured',details:`${semester} · ${year} · ${department}`,timestamp:new Date().toLocaleString()});saveDB(db);showToast('Semester configuration added.','success');renderApp();}
        function adminSaveRegistrationSettings(e){e.preventDefault();const db=getDB();db.settings.allowRegistration=document.getElementById('reg-open').value==='true';db.settings.academicYear=document.getElementById('reg-year').value.trim();db.auditLogs=db.auditLogs||[];db.auditLogs.push({action:'Registration settings changed',details:`Registration ${db.settings.allowRegistration?'opened':'closed'}; ${db.settings.academicYear}`,timestamp:new Date().toLocaleString()});saveDB(db);showToast('Registration settings saved.','success');renderApp();}
        function adminToggleQuiz(id){const db=getDB();const q=db.quizzes.find(x=>x.id===id);if(!q)return;q.status=q.status==='Stopped'?'Open':'Stopped';db.auditLogs=db.auditLogs||[];db.auditLogs.push({action:q.status==='Stopped'?'Quiz stopped':'Quiz reopened',details:q.title,timestamp:new Date().toLocaleString()});saveDB(db);showToast(`Quiz ${q.status.toLowerCase()}.`,'success');renderApp();}
        function adminCreateAnnouncement(e){e.preventDefault();const db=getDB();db.announcements=db.announcements||[];const title=document.getElementById('ann-title').value.trim(),message=document.getElementById('ann-message').value.trim(),audience=document.getElementById('ann-audience').value;db.announcements.push({id:'ANN'+Date.now(),title,message,audience,date:new Date().toISOString().slice(0,10),createdBy:appState.currentUser?.id||'admin'});db.auditLogs=db.auditLogs||[];db.auditLogs.push({action:'Announcement published',details:title,timestamp:new Date().toLocaleString()});saveDB(db);showToast('Announcement published.','success');renderApp();}
        function adminExportAuditLog(){const db=getDB(),logs=db.auditLogs||[];const rows=[['Action','Details','Timestamp'],...logs.map(x=>[x.action,x.details,x.timestamp])];const csv=rows.map(r=>r.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')).join('\n');const blob=new Blob([csv],{type:'text/csv'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='lms-admin-audit-log.csv';a.click();URL.revokeObjectURL(url);}
