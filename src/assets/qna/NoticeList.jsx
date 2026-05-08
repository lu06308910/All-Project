import React from "react";
import { Link } from "react-router-dom";
import './../css/seul.css';

function NoticeList() {
  return (
    <div style={{ marginTop: '150px', marginBottom: '100px', width: '90%', display: 'flex', gap: '60px' }}>

      {/* ▷ 왼쪽 사이드 메뉴 */}
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


      {/* ▷ 오른쪽 공지사항 목록 */}
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
          <p style={{ margin: '0 0 15px 0', fontSize: '15px' }}>총 <strong>1325</strong>개의 공지사항이 있습니다.</p>

          <table style={{ width: '100%', borderTop: '2px solid #000', fontSize: '15px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ccc', height: '50px' }}>
                <th style={{ width: '80px' }}>번호</th>
                <th style={{ width: '120px' }}>단체명</th>
                <th>제목</th>
                <th style={{ width: '120px' }}>공지일</th>
              </tr>
            </thead>

            <tbody>
              <tr style={{ borderBottom: '1px solid #eee', height: '48px' }}>
                <td>6253</td>
                <td>CANVAS</td>
                <td><Link to="/qna/noticeview" style={{textDecoration:'none',color:'black'}}>[정기점검 발표] 20년 03월 ... 교육기관 일정 안내</Link></td>
                <td>2020.04.13</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #eee', height: '48px' }}>
                <td>6252</td>
                <td>CANVAS</td>
                <td><Link to="/qna/noticeview" style={{textDecoration:'none',color:'black'}}>전달 이용약관 변경 (2020. 04. 15)</Link></td>
                <td>2020.04.08</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '25px', gap: '10px', fontSize: '15px' }}>
          <span>&laquo;</span>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
          <span>6</span>
          <span>7</span>
          <span>8</span>
          <span>9</span>
          <span>10</span>
          <span>&raquo;</span>
        </div>

      </div>

    </div>
  );
}

export default NoticeList;