import classNames from 'classnames/bind';
import {
    HomeOutlined,
    MailOutlined,
    EditOutlined,
    CalendarOutlined,
    PieChartOutlined,
    SettingOutlined,
    UserOutlined,
    BellOutlined,
    FileTextOutlined,
    ShopOutlined,
    InboxOutlined,
    SendOutlined,
} from '@ant-design/icons';
import styles from './Sidebar.module.scss';
import logo from '../../../../assets/images/logo.png';
import NavItem from '../NavItem';

const cx = classNames.bind(styles);

const sideBar = [
    {
        title: 'Dashboard',
        color: '#44a2f5',
        icon: <HomeOutlined />
    },
    {
        title: 'Email',
        color: '#795648',
        icon: <MailOutlined />,
        children: [
            {title: 'Inbox', icon: <InboxOutlined /> },
            { title: 'Sent', icon: <SendOutlined /> },
        ]
    },
    {
        title: 'Movie',
        color: '#7b53c0',
        icon: <EditOutlined />,
        url: '/admin/movie'
    },
    {
        title: 'Calendar',
        color: '#e91e63',
        icon: <CalendarOutlined />,
        url: '/auth/login'
    },
    {
        title: 'Charts',
        color: '#01a9f4',
        icon: <PieChartOutlined />
    },
    {
        title: 'Settings',
        color: '#ff9800',
        icon: <SettingOutlined />
    },
    {
        title: 'Profile',
        color: '#9c27b0',
        icon: <UserOutlined />
    },
    {
        title: 'Notifications',
        color: '#f44336',
        icon: <BellOutlined />
    },
    {
        title: 'Documents',
        color: '#4caf50',
        icon: <FileTextOutlined />
    },
    {
        title: 'Store',
        color: '#3f51b5',
        icon: <ShopOutlined />
    },
];

function Sidebar() {
    
    return (
        <div className={cx('side-bar')}>
            <div className={cx('sidebar-inner')}>
                <div className={cx('sidebar-logo')}>
                    <div className={cx('logo')}>
                        <img src={logo} alt="logo" />
                    </div>
                    <div className={cx('logo-text')}>Adminator</div>
                </div>

                <div className={cx('sidebar-menu')}>
                    {sideBar.map((item, index) => (
                        <NavItem
                            key={index}
                            title={item.title}
                            color={item.color}
                            icon={item.icon}
                            children={item.children}
                            url={item.url}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;








// package carevn.luv2code.MovieNest.security;

// import lombok.RequiredArgsConstructor;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.authentication.AuthenticationProvider;
// import org.springframework.security.authentication.ProviderManager;
// import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.servlet.config.annotation.CorsRegistry;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// import java.util.Arrays;
// import java.util.List;

// @Configuration
// @EnableWebSecurity
// @EnableMethodSecurity
// @RequiredArgsConstructor
// public class SecurityConfig {

//     private final JwtAuthenticationFilter jwtAuthenticationFilter;
//     private final UserDetailsServiceImpl userDetailsService;

//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//         http
//                 .csrf(csrf -> csrf.disable())
//                 .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                 .authorizeHttpRequests(auth -> auth
//                         // Public endpoints
//                         .requestMatchers("/api/auth/**").permitAll()

//                         // User endpoints
//                         .requestMatchers("/api/user/**").hasAnyRole("USER", "ADMIN")

//                         // User endpoints for movies
//                         .requestMatchers("/api/movie/**").hasAnyRole("USER", "ADMIN")

//                         // Admin-only endpoints
//                         .requestMatchers("/api/admin/**").hasRole("ADMIN")

//                         .requestMatchers("/api/trailers/**").hasRole("ADMIN")

//                         // Moderator endpoints
//                         .requestMatchers("/api/moderator/**").hasAnyRole("MODERATOR", "ADMIN")

//                         // Default to authenticated
//                         .anyRequest().authenticated()
//                 )
//                 .cors(cors -> cors.configurationSource(request -> {
//                     CorsConfiguration configuration = new CorsConfiguration();
//                     configuration.setAllowedOrigins(List.of("http://localhost:3000"));
//                     configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
//                     configuration.setAllowedHeaders(List.of("*"));
//                     configuration.setAllowCredentials(true);
//                     return configuration;
//                 }))

//                 .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

//         return http.build();
//     }

//     @Bean
//     public AuthenticationManager authenticationManager() {
//         DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
//         authProvider.setUserDetailsService(userDetailsService);
//         authProvider.setPasswordEncoder(passwordEncoder());

//         return new ProviderManager(authProvider);
//     }

//     @Bean
//     public AuthenticationProvider authenticationProvider() {
//         DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
//         authProvider.setUserDetailsService(userDetailsService);
//         authProvider.setPasswordEncoder(passwordEncoder());
//         return authProvider;
//     }

//     @Bean
//     public WebMvcConfigurer corsConfigurer() {
//         return new WebMvcConfigurer() {
//             @Override
//             public void addCorsMappings(CorsRegistry registry) {
//                 registry.addMapping("/**")  // Thay đổi từ "/api/**" sang "/**"
//                         .allowedOrigins("http://localhost:3000")
//                         .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // Thêm OPTIONS
//                         .allowedHeaders("*")
//                         .allowCredentials(true);
//             }
//         };
//     }

//     @Bean
//     public PasswordEncoder passwordEncoder() {
//         return new BCryptPasswordEncoder();
//     }
// }