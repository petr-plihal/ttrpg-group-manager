<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<style>
    .navbar {
        background-color: #333;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
    }

    .logo {
        color: white;
        font-size: 1.5rem;
        font-weight: bold;
        text-decoration: none;
    }

    .nav-links {
        display: flex;
        list-style: none;
    }

    .nav-links li {
        margin-left: 1rem;
    }

    .nav-links a {
        color: white;
        text-decoration: none;
        transition: color 0.3s ease;
    }

    .nav-links a:hover {
        color: #ddd;
    }

    .hamburger {
        display: none;
        flex-direction: column;
        cursor: pointer;
    }

    .bar {
        width: 25px;
        height: 3px;
        background-color: white;
        margin: 3px 0;
    }

    @media screen and (max-width: 768px) {
        .nav-links {
            display: none;
            flex-direction: column;
            width: 100%;
            position: absolute;
            top: 70px;
            left: 0;
            background-color: #333;
            text-align: center;
        }

        .nav-links.active {
            display: flex;
        }

        .nav-links li {
            margin: 10px 0;
        }

        .hamburger {
            display: flex;
        }
    }
</style>

<body>
    <nav class="navbar">
        <div class="logo">Your Logo</div>
        
        <div class="hamburger">
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
        </div>

        <ul class="nav-links">
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Portfolio</a></li>
            <li><a href="#">Contact</a></li>
        </ul>
    </nav>

    <script>
        function toggleMenu() {
            const navLinks = document.querySelector('.nav-links');
            navLinks.classList.toggle('active');
        }
    </script>
</body>


{@render children()}
