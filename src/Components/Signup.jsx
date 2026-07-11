import "./Signup.css"
import video from "../Images/vdo.mp4"
import googleIcon from "../Images/google.png"
import logo from "../Images/logo_img.png"

function SignUpPage() {

    return(

        <div className="whole-section">
        <div className="container">

        <div className="logo">
          <img src={logo} alt="CookCraft Logo" className="logo_img" />
        </div>

            <h1>Create an account</h1>
            <p>Cook. Save. Savor.</p>
            <br/><br/>

            <form className="sign-up_form">
                <div class="input-box">
                    <input type="text" placeholder="Enter your username " required/>
                </div>


                <div className="input-box">
                    <input type="email" placeholder="Enter your email" required/>

                </div>
            
                <div className="input-box">
                    <input type="password" placeholder="Enter your password" required/>
                    <i className="fa-solid fa-eye-slash"></i>
                </div>

                <div className="input-box">
                    <input type="password" placeholder="Confirm password" required/>
                    <i className="fa-solid fa-eye-slash"></i>
                </div>
             
                <div className="check-box">
                    <div className="terms">
                        <input type="checkbox"/>
                        <label><a href="#">Accept terms & Conditions</a></label>
                    </div>
                </div>
          
                <button  type="submit" className="Sign">Sign Up</button>
                <div class="or">or</div><br/>

                <button type="button" className="google-btn">
                <img src={googleIcon} alt="Google" className="google-icon"/>
                <span>Sign up using Google</span>
                </button>
              
                <p class="signup-text">Already have an account? <b><a href="#login.html">Sign in</a></b></p>

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

        <script>
            const video = document.getElementById("bg-video");
            video.playbackRate = 0.25;
        </script>

    </div>

    )
};

export default SignUpPage;