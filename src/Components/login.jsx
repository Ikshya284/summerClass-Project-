import "./login.css"
import video from "../Images/vdo.mp4"
import googleIcon from "../Images/google.png"
import logo from "../Images/logo_img.png"

function LoginPage(){

    return( 

    
    <div className="whole-section">
        <div className="container">
            
        <div className="logo">
          <img src={logo} alt="CookCraft Logo" className="logo_img" />
        </div>

            <h1>Welcome back!</h1>
            <p>Cook. Save. Savor.</p>


            <form className="login_form">
                <div className="input-box">
                    <input type="email" placeholder="Enter your email" id="email_input" />
                    <i className="fa-solid fa-user"></i>
                </div>
            
                <div className="input-box">
                    <input type="password" id="password" placeholder="Enter your password"/>
                    <i className="fa-solid fa-eye-slash" id="password-icon"></i>
                </div>

                <div className="check-box">
                    <div className="remember">
                        <input type="checkbox"/>
                        <label>Remember Me</label>
                    </div>


        
                    <a href="#">Forgot Password?</a>
                </div>
                

                <button  type="submit" className="login-btn">Login</button><br/>
                <div className="or">or</div><br/><br/>

                <button type="button" className="google-btn">
                <img src={googleIcon} alt="Google" className="google-icon"/>
                <span>Continue with Google</span>
                </button>
                <br/> <br/>
                <p className="signup-text">Don't have an account? <b><a href="#">Sign up</a></b></p>

            </form>


        </div>

        <div className="image-section">

            <video
                src={video}
                autoPlay
                muted
                loop
                className="video"
            />
        </div>


    </div>
)
};

export default LoginPage;