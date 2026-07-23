import React from "react";
import logo from "../../Images/logo_img.png";


// Navbar Component
// Navbar Component
function Navbar() {

  const menuItems = [
    "Home",
    "Recipes",
    "Categories",
    "About",
    "Contact"
  ];

  return (
    <nav className="sticky top-0 z-10 bg-[#FAF8F5]/90 backdrop-blur border-b border-orange-100">

      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">


        {/* Logo */}
        <img
          src={logo}
          alt="CookCraft"
          className="w-28"
        />



        {/* Navigation */}
        <ul className="hidden lg:flex gap-10 font-medium text-gray-800">


          {
            menuItems.map((item)=>(
              
              <li
                key={item}
                className={`relative cursor-pointer group
                ${
                  item === "Home"
                  ? "text-[#F38D39]"
                  : "hover:text-[#F38D39]"
                }`}
              >

                {item}


                {/* Active underline */}
                {
                  item === "Home" && (
                    <span className="
                    absolute
                    left-0
                    -bottom-2
                    w-full
                    h-[3px]
                    bg-[#F38D39]
                    rounded-full
                    ">
                    </span>
                  )
                }



                {/* Hover underline */}
                {
                  item !== "Home" && (

                    <span className="
                    absolute
                    left-0
                    -bottom-2
                    h-[3px]
                    w-0
                    bg-[#F38D39]
                    rounded-full
                    transition-all
                    duration-300
                    group-hover:w-full
                    ">
                    </span>

                  )
                }


              </li>

            ))
          }


        </ul>




        {/* Admin Profile */}

        <div className="flex items-center gap-4">


          <button className="
          bg-[#F38D39]
          text-white
          px-6
          py-3
          rounded-full
          hover:bg-[#e97c25]
          shadow
          ">

            Get Started

          </button>



          <div className="
          bg-white
          rounded-full
          px-3
          py-2
          shadow
          flex
          items-center
          gap-3
          ">


            <div className="
            w-10
            h-10
            rounded-full
            bg-[#F38D39]
            flex
            items-center
            justify-center
            text-white
            ">

              <i className="fa-regular fa-circle-user"></i>

            </div>



            <div className="hidden md:block">

              <p className="font-semibold text-sm">
                Admin
              </p>

              <p className="text-xs text-gray-500">
                CookCraft Manager
              </p>

            </div>


          </div>


        </div>


      </div>

    </nav>
  );
}

// Statistics Card Component
function StatsCard({icon, value, title}) {

  return (

    <div className="bg-white rounded-3xl p-8 shadow hover:shadow-xl transition">


      <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">

        <i className={`fa-solid ${icon} text-3xl text-[#F38D39]`}></i>

      </div>


      <h2 className="text-4xl font-bold mt-6">
        {value}
      </h2>


      <p className="text-gray-500 mt-2">
        {title}
      </p>


    </div>

  );

}




// Quick Action Card Component
function ActionCard({icon, title, description}) {


  return (

    <div className="bg-white rounded-3xl p-7 shadow hover:-translate-y-2 transition">


      <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center">

        <i className={`fa-solid ${icon} text-2xl text-[#F38D39]`}></i>

      </div>


      <h3 className="text-xl font-bold mt-5">
        {title}
      </h3>


      <p className="text-gray-500 mt-3">
        {description}
      </p>


    </div>

  );

}





// Main Home Function
export default function Home() {


const stats = [

{
title:"Total Recipes",
value:"250",
icon:"fa-utensils"
},

{
title:"Total Users",
value:"1200",
icon:"fa-users"
},

{
title:"Pending Approval",
value:"15",
icon:"fa-clock"
},

{
title:"Reports",
value:"8",
icon:"fa-flag"
}

];



const actions = [

{
title:"Add Recipe",
description:"Create new recipes",
icon:"fa-plus"
},

{
title:"Manage Recipes",
description:"Edit and update recipes",
icon:"fa-utensils"
},

{
title:"Manage Users",
description:"Control user accounts",
icon:"fa-users"
},

{
title:"Analytics",
description:"View platform insights",
icon:"fa-chart-line"
}

];



const recipes=[

{
name:"Chicken Momo",
category:"Nepali",
status:"Active"
},

{
name:"Chicken Biryani",
category:"Indian",
status:"Pending"
},

{
name:"Alfredo Pasta",
category:"Italian",
status:"Active"
}

];



return (

<div className="min-h-screen bg-[#FAF8F5]">


<Navbar />



{/* Welcome */}

<section className="max-w-7xl mx-auto px-8 py-14">


<p className="uppercase tracking-[5px] text-[#F38D39] font-semibold">
Admin Panel
</p>


<h1 className="text-5xl font-bold mt-4">

Welcome Back,

<span className="text-[#F38D39]">
 Admin
</span>

</h1>


<p className="text-gray-600 text-lg mt-5">

Manage your CookCraft recipes, users,
and activities easily.

</p>


</section>





{/* Statistics */}


<section className="max-w-7xl mx-auto px-8">


<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">


{
stats.map((item,index)=>(

<StatsCard
key={index}
icon={item.icon}
value={item.value}
title={item.title}
/>

))
}


</div>


</section>






{/* Quick Actions */}


<section className="max-w-7xl mx-auto px-8 py-16">


<h2 className="text-3xl font-bold">
Quick Actions
</h2>


<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">


{
actions.map((item,index)=>(

<ActionCard
key={index}
icon={item.icon}
title={item.title}
description={item.description}
/>

))
}


</div>


</section>







{/* Recipe Table */}


<section className="max-w-7xl mx-auto px-8 pb-16">


<h2 className="text-3xl font-bold mb-8">
Recent Recipes
</h2>


<div className="bg-white rounded-3xl shadow overflow-hidden">


<table className="w-full">


<thead className="bg-orange-100">

<tr>

<th className="p-5 text-left">
Recipe
</th>

<th className="p-5">
Category
</th>

<th className="p-5">
Status
</th>

</tr>

</thead>



<tbody>


{
recipes.map((item,index)=>(

<tr key={index} className="border-t">


<td className="p-5 font-semibold">
{item.name}
</td>


<td className="text-center">
{item.category}
</td>


<td className="text-center">

<span className="bg-green-100 text-green-700 px-4 py-2 rounded-full">

{item.status}

</span>

</td>


</tr>

))
}


</tbody>


</table>


</div>


</section>







<footer className="bg-white border-t py-8 text-center text-gray-500">

© 2026 CookCraft Admin Dashboard

</footer>



</div>

);

}