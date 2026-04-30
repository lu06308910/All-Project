import { useState } from 'react'
import { Outlet } from "react-router-dom"
import axios from 'axios';
import '/src/assets/css/Ls_style.css'


function Login() {
        // 아이디와 비밀번호를 보관할 useState변수 생성
        const [formData, setFormData] = useState({ userid: '', userpwd: '' });
        const [loginIdErrorMessage, setLoginIdErrorMessage] = useState(''); // 부적합할 때
        const [loginIdSuccessMessage, setLoginIdSuccessMessage] = useState(''); // 적합할 때

        const [loginPwdErrorMessage, setLoginPwdErrorMessage] = useState(''); //비번 부적합할 때
        const [loginPwdSuccessMessage, setLoginPwdSuccessMessage] = useState(''); //비번 적합할 때

        // 사용자가 폼에 값을 입력하면 useState변수에 대입하는 함수
        const loginFormRender = (event) => {
                // event 변수의 input태그의 name속성의 값을 구하여
                //             아이디 박스면 userid, 비밀번호 박스면 userpwd의 값을 변경
                const name = event.target.name; // userid = key
                const value = event.target.value; // value = value

                setFormData((p) => {
                        // spread 연산자    (...)이전 데이터 보존 됨
                        return { ...p, [name]: value }
                })

                if (name == 'userid') {//아이디가 입력되었을 때

                        // 아이디가 유효성에 적합한지 확인하여 에러메세지 표시 => 영어,숫자,_만 허용,8~12글자까지 허용
                        var reg = /[A-Za-z0-9]{5,10}$/

                        if (reg.test(value)) { // true -> 적합하다.       false:위배된다.
                                setLoginIdSuccessMessage('사용가능한 아이디입니다.');
                                setLoginIdErrorMessage('');
                        } else {
                                setLoginIdErrorMessage('아이디는 5~10글자만 가능합니다');
                                setLoginIdSuccessMessage('');
                        }
                }
                else if (name == 'userpwd') {// 비밀번호가 입력되었을 때
                        var reg = /^[A-Za-z0-9!@#]{8,12}$/

                        if (reg.test(value)) { // true -> 적합하다.       false:위배된다.
                                setLoginPwdSuccessMessage('사용가능한 비밀번호입니다.');
                                setLoginPwdErrorMessage('');
                        } else {
                                setLoginPwdErrorMessage('비밀번호는 8~12글자 사이이며, 영대소문자, 숫자, !@#만 허용');
                                setLoginPwdSuccessMessage('');
                        }

                }

        }

        function loginStart(event) {
                // form태그의 기본 이벤트중에 페이지 이동 기능을 해제한다.
                event.preventDefault();

                //아이디 존재유무
                if (formData.userid == '') {
                        setLoginIdSuccessMessage('아이디를 입력 후 로그인 하세요.');
                        return false;
                }
                //비밀번호 존재유무
                if (formData.userpwd == '') {
                        alert('비밀번호를 입력 후 로그인하세요...');
                        return false;
                }

                // 백엔드
                // 비동기식 호출 : axios, XMLHttpRequset, ajax()
                axios.post('http://192.168.4.86:9988/login', {
                        userid: formData.userid,
                        userpwd: formData.userpwd
                })
                        .then(function (response) {
                                console.log(response.data)
                                if (response.data.logStatus == 'N') {
                                        alert("로그인 실패")
                                } else if (response.data.logStatus == 'Y') {
                                        //로그인 성공
                                        // sessionStorage에 로그인 정보담기
                                        // {userid:'aaaa', username:'bbbb'}=> "{\"userid\":\"aaaa\", \"username\":\"bbbb\"}"
                                        var sessionStr = JSON.stringify(response.data.user);
                                        window.sessionStorage.setItem('user', sessionStr);
                                        window.sessionStorage.setItem('logStatus', response.data.logStatus)
                                        //home페이지로 이동
                                        window.location.href = "/"

                                }


                        })
                        .catch(function (error) {
                                console.log(error)
                        })
        }
        return (
                <div className="login" style={{ width: '600px', margin: '200px auto' }}>
                        <h2 style={{ textAlign: 'center', fontSize: '2em', margin: '0' }}>HOME LOG</h2>
                        <h2 style={{ marginBottom: '100px', textAlign: 'center', fontWeight: 'bold', fontSize: '4em' }}>SIGN IN</h2>
                        <form method="post" onSubmit={loginStart}>
                                <div style={{ marginBottom: '30px' }}>
                                        <label for="userid" style={{ fontWeight: 'bold', fontSize: '1.2em' }}>ID</label>
                                        <input type="text" className="form" id="userid" placeholder="아이디를 입력하세요."
                                                name="userid" onChange={loginFormRender}
                                                style={{ height: '60px', width: '100%', border: '1px solid #fff', borderBottom: '3px solid #777' }} />
                                        <div style={{ color: '#f00', margin: '10px 0', fontSize: '1.2em' }}>{loginIdErrorMessage}</div>
                                        <div style={{ color: 'rgb(15, 182, 15)', margin: '10px 0', fontSize: '1.2em' }}>{loginIdSuccessMessage}</div>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                        <label for="userpwd" style={{ fontWeight: 'bold', fontSize: '1.2em' }}>PASSWORD</label>
                                        <input type="password" className="form" id="userpwd" placeholder="비밀번호를 입력하세요."
                                                name="userpwd" onChange={loginFormRender}
                                                style={{ height: '60px', width: '100%', border: '1px solid #fff', borderBottom: '3px solid #777' }} />
                                        <div style={{ color: '#f00', margin: '10px 0', fontSize: '1.2em' }}>{loginPwdErrorMessage}</div>
                                        <div style={{ color: 'rgb(15, 182, 15)', margin: '10px 0', fontSize: '1.2em' }}>{loginPwdSuccessMessage}</div>
                                </div>
                                <div class="d-grid gap-3">
                                        {/* 
                                        <input type='submit' value="로그인"/>
                                        <input type='button' value="로그인"/>
                                        <input type='img' src=""/>

                                        <button>로그인</button>
                                        리엑트에서는 button태그가 submit이 기본으로 발생하지 않는다.
                                */}
                                        <button type="submit" className="btn btn-dark"
                                                style={{ borderRadius: '30px', height: '60px', fontSize: '1.5em', fontWeight: 'bold', marginTop: '50px' }}>
                                                Login
                                        </button>
                                </div>
                                <div style={{ margin: '10px 0' }}>
                                        <a href="" style={{ marginLeft: '10px', color: 'black', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1em' }}>ID | PASSWORD 찾기</a>
                                        <a href="/member/member" style={{ marginLeft: '300px', color: 'black', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1em' }}>회원가입</a>
                                </div>
                                <div style={{ textAlign: 'center', borderTop: '1px solid #979797', marginTop: '90px', paddingTop: '50px' }}>
                                        <img src="/src/assets/img/google.png" style={{ width: '50px', cursor: 'pointer', marginRight: '20px' }} />
                                        <img src="/src/assets/img/apple.png" style={{ width: '50px', cursor: 'pointer', marginRight: '20px' }} />
                                        <img src="/src/assets/img/facebook.png" style={{ width: '50px', cursor: 'pointer', marginRight: '20px' }} />

                                </div>

                        </form>
                </div>

        )


}
export default Login