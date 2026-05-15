import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios"
import './../css/seul.css';

function NoticeList() {
  const [noticeList, setNoticeList] = useState([]); // 공지사항 데이터 상태

  // 관리자 여부 확인 (세션 스토리지에서 직접 확인)
  const isLogin = window.sessionStorage.getItem("logStatus") === "Y";
  const logId = window.sessionStorage.getItem("logId");
  const isAdmin = isLogin && logId === "admin";

  // 백엔드(Spring Boot)에서 공지사항 리스트 가져오기
  useEffect(() => {
    axios.get("http://localhost:9991/notice/list")
      .then(response => {
        console.log("받아온 데이터 확인:", response.data);
        // 최신글이 위로 오도록 정렬 (id 기준 내림차순)
        if (Array.isArray(response.data)) {
          const sortedData = response.data.sort((a, b) => b.id - a.id);
          setNoticeList(sortedData);
        }
      })
      .catch(error => {
        console.error("데이터 로딩 중 오류 발생:", error);
      });
  }, []);

  return (
    <div style={{ marginTop: '150px', marginBottom: '100px', width: '90%', display: 'flex', gap: '60px' }}>

      {/* 왼쪽 사이드 메뉴 */}
      <div className="side-menu" style={{ width: '220px' }}>

        {/* 사이드 메뉴 타이틀 */}
        <div style={{ width: '220px', borderBottom: '2px solid #000', paddingBottom: '12px', marginBottom: '25px' }}>
          <h2 style={{ margin: 0, fontSize: '22px' }}>서비스 지원</h2>
        </div>

        {/* 메뉴 목록 */}
        <div className="qna-menu"><Link to="/qna">자주하는 질문</Link></div>
        <div className="qna-menu active"><Link to="/qna/write">1:1 문의하기</Link></div>
        <div className="qna-menu"><Link to="/qna/noticelist">공지사항</Link></div>
      </div>

      {/* 오른쪽 공지사항 목록 */}
      <div style={{ flexGrow: 1 }}>

        {/* 공지 테이블 */}
        <div style={{ minHeight: '500px' }}>
          {/* 검색창 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '1px solid #ddd',
            padding: '15px',
            marginBottom: '20px'
          }}>
            <input type="text" placeholder="제목을 입력해주세요"
              style={{ border: 'none', width: '90%', outline: 'none', fontSize: '16px' }} />
            <button className="search-icon"></button>
          </div>

          {/* 상단 개수 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ margin: '0 0 15px 0', fontSize: '15px' }}>총 <strong>{noticeList.length}</strong>개의 공지사항이 있습니다.</p>
            {isAdmin && (
              <button
                className="btn btn-dark"
                style={{ marginBottom: '10px' }}
                onClick={() => { window.location.href = "/qna/noticewrite" }}
              >공지 등록</button>
            )}
          </div>
          <table style={{ width: '100%', borderTop: '2px solid #000', fontSize: '15px', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ccc', height: '50px', backgroundColor: '#f9f9f9' }}>
                <th style={{ width: '80px',textAlign: 'center' }}>번호</th>
                <th style={{ width: '120px',textAlign: 'center' }}>작성자</th>
                <th style={{textAlign: 'center'}}>제목</th>
                <th style={{ width: '120px',textAlign: 'center' }}>공지일</th>
              </tr>
            </thead>

            <tbody>
              {noticeList.length > 0 ? (
                noticeList.map((notice) => (
                  <tr key={notice.id} style={{ borderBottom: '1px solid #eee', height: '52px'}}>
                    <td style={{ textAlign: 'center', color: '#666' }}>{notice.n_id}</td>
                    <td style={{ textAlign: 'center', color: '#666' }}>canvas</td>
                    <td style={{ textAlign: 'left', paddingLeft: '20px',whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <Link to={`/qna/noticeview/${notice.n_id}`} style={{ textDecoration: 'none', color: 'black' }}>
                        {notice.subject}
                      </Link>
                    </td>
                    <td style={{ textAlign: 'center', color: '#888' }}>{new Date(notice.writedate).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ padding: '80px 0', textAlign: 'center', color: '#999' }}>
                    등록된 공지사항이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '25px', gap: '10px', fontSize: '15px' }}>
          <span>&laquo;</span>
          <span style={{ fontWeight: 'bold' }}>1</span>
          <span>&raquo;</span>
        </div>

      </div>

    </div >
  );
}

export default NoticeList;