-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 27-05-2025 a las 14:16:32
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `proyecto_integrador`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cervezas`
--

CREATE TABLE `cervezas` (
  `id` int(11) NOT NULL,
  `nombre_cerveza` varchar(255) NOT NULL,
  `descripcion_cerveza` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `cervezas`
--

INSERT INTO `cervezas` (`id`, `nombre_cerveza`, `descripcion_cerveza`) VALUES
(1, 'Galaxitra - American IPA', 'IPA con un perfil lupulado intenso y notas cítricas.'),
(2, 'Flanders Red - Sour Power', 'Cerveza ácida con un toque afrutado y complejo.'),
(3, 'Kill your IPA', 'IPA con un amargor pronunciado y gran cuerpo.'),
(4, 'Hop de Lis - Belgian IPA', 'IPA belga con un equilibrio entre dulzor y amargor.'),
(5, 'Patagonia IPA Doble', 'IPA con mayor graduación alcohólica y fuerte presencia de lúpulo.'),
(6, 'Milk Stout', 'Cerveza negra con notas de café y chocolate, con un toque dulce.'),
(7, 'Hazy IPA', 'IPA turbia con un perfil frutal y suave.'),
(8, 'IPA Sanfer', 'IPA con un amargor equilibrado y aroma floral.'),
(9, 'Pacific Ale', 'Cerveza ligera con notas tropicales y refrescantes.'),
(10, '2 Bondis APA', 'American Pale Ale con un perfil maltoso y lupulado.'),
(11, 'Honey Kellan', 'Cerveza con miel artesanal premium, con un toque dulce y suave.'),
(12, 'Barba Roja Maltzbier', 'Cerveza negra dulce con notas de malta caramelizada.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `galeria`
--

CREATE TABLE `galeria` (
  `id_galeria` int(11) NOT NULL,
  `fk_usuario` int(11) DEFAULT NULL,
  `img_galeria` varchar(255) NOT NULL,
  `pie_galeria` text DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `galeria`
--

INSERT INTO `galeria` (`id_galeria`, `fk_usuario`, `img_galeria`, `pie_galeria`, `fecha_creacion`) VALUES
(26, 49, 'img_galeria-1747789150421-574357138.PNG', 'La pase genial!!', '2025-05-20 21:59:10'),
(27, 50, 'img_galeria-1747789192423-519086042.PNG', 'Hermoso lugar!', '2025-05-20 21:59:52'),
(28, 51, 'img_galeria-1747789210628-758407215.PNG', 'Me encanto', '2025-05-20 22:00:10'),
(29, 52, 'img_galeria-1747865773581-843721056.PNG', 'Me encantoooooo', '2025-05-21 19:16:13'),
(30, 51, 'img_galeria-1747869051392-215603408.PNG', 'lalalalala', '2025-05-21 20:10:51'),
(32, 48, 'img_galeria-1748289769839-385032281.PNG', 'jajajaja', '2025-05-26 17:02:49');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `generos`
--

CREATE TABLE `generos` (
  `id_genero` int(4) NOT NULL,
  `nombre_genero` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `generos`
--

INSERT INTO `generos` (`id_genero`, `nombre_genero`) VALUES
(1, 'Masculino'),
(2, 'Femenino'),
(3, 'Otro');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `provincias`
--

CREATE TABLE `provincias` (
  `id_provincia` int(4) NOT NULL,
  `nombre_provincia` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `provincias`
--

INSERT INTO `provincias` (`id_provincia`, `nombre_provincia`) VALUES
(1, 'Buenos Aires'),
(2, 'CABA'),
(3, 'Catamarca'),
(4, 'Chaco'),
(5, 'Chubut'),
(6, 'Córdoba'),
(7, 'Corrientes'),
(8, 'Entre Ríos'),
(9, 'Formosa'),
(10, 'Jujuy'),
(11, 'La Pampa'),
(12, 'La Rioja'),
(13, 'Mendoza'),
(14, 'Misiones'),
(15, 'Neuquén'),
(16, 'Río Negro'),
(17, 'Salta'),
(18, 'San Juan'),
(19, 'San Luis'),
(20, 'Santa Cruz'),
(21, 'Santa Fe'),
(22, 'Santiago del Estero'),
(23, 'Tierra del Fuego'),
(24, 'Tucumán');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(4) NOT NULL,
  `nombre_rol` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre_rol`) VALUES
(1, 'Admin'),
(2, 'Usuario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `usuario` varchar(25) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `imagen_perfil` varchar(255) DEFAULT NULL,
  `fk_rol` int(4) NOT NULL,
  `email` varchar(50) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `fk_genero` int(4) NOT NULL,
  `fk_provincia` int(4) NOT NULL,
  `contrasenia` varchar(250) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `debe_cambiar_contrasenia` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `usuario`, `nombre`, `apellido`, `imagen_perfil`, `fk_rol`, `email`, `fecha_nacimiento`, `fk_genero`, `fk_provincia`, `contrasenia`, `fecha_creacion`, `debe_cambiar_contrasenia`) VALUES
(48, 'Prueba1111', 'Pruebauno', 'Pruebauno', 'imagen_perfil-1747782040443-719165785.PNG', 1, 'prueba1111@gmail.com', '1985-12-01', 1, 14, '$2b$08$gCeYntbz20aaYKlGbNjCQOITlUN6kLCJ.GQDjb7/LZqA4G8F2crdO', '2025-05-20 23:00:40', 0),
(49, 'Prueba2222', 'Pruebados', 'Pruebados', 'imagen_perfil-1747782235655-815510046.PNG', 2, 'prueba2222@gmail.com', '1985-06-15', 1, 13, '$2b$08$HcG1tQa9nc0maQ9vCdWXlOMjyaLOUWMD2lPYE9n0DoVkwEaGQ0w/K', '2025-05-20 23:03:55', 0),
(50, 'Prueba3333', 'Pruebatres', 'Pruebatres', 'imagen_perfil-1747787448519-643151770.PNG', 2, 'prueba3333@gmail.com', '1995-06-12', 1, 1, '$2b$08$nKYx7DSLMl1PYPzSMo7hUeI5jWlSgJ/kxaR4CacDIz4O14hnimmVq', '2025-05-21 00:30:48', 0),
(51, 'Prueba4444', 'Pruebacuatro', 'Pruebacuatro', 'imagen_perfil-1747787637567-450466960.PNG', 2, 'prueba4444@gmail.com', '1996-03-15', 2, 13, '$2b$08$pVTPJTBDZ7DTL.ux8ndCf.cCNA.S0QuIANRc/DbYANMjz8hrt0PUW', '2025-05-21 00:33:57', 0),
(52, 'Prueba5555', 'Pruebacinco', 'Pruebacincoo', 'imagen_perfil-1747787744392-362651055.PNG', 2, 'prueba5555@gmail.com', '2000-11-16', 2, 12, '$2b$08$2BLKqagnTmm.KMeHCscPrOdHTqD59tyuMLYhG2HakrNYgTSoQLpzO', '2025-05-21 00:35:44', 0),
(57, 'Prueba7777', 'Pruebasiete', 'Pruebasiete', 'imagen_perfil-1748300844894-84094684.PNG', 2, 'prueba7777@gmail.com', '1975-05-15', 1, 16, '8ha6t7o4', '2025-05-26 23:07:24', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cervezas`
--
ALTER TABLE `cervezas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `galeria`
--
ALTER TABLE `galeria`
  ADD PRIMARY KEY (`id_galeria`),
  ADD KEY `fk_usuario` (`fk_usuario`);

--
-- Indices de la tabla `generos`
--
ALTER TABLE `generos`
  ADD PRIMARY KEY (`id_genero`);

--
-- Indices de la tabla `provincias`
--
ALTER TABLE `provincias`
  ADD PRIMARY KEY (`id_provincia`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `usuario` (`usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_rol` (`fk_rol`),
  ADD KEY `fk_genero` (`fk_genero`),
  ADD KEY `fk_provincia` (`fk_provincia`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cervezas`
--
ALTER TABLE `cervezas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `galeria`
--
ALTER TABLE `galeria`
  MODIFY `id_galeria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de la tabla `generos`
--
ALTER TABLE `generos`
  MODIFY `id_genero` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `provincias`
--
ALTER TABLE `provincias`
  MODIFY `id_provincia` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `galeria`
--
ALTER TABLE `galeria`
  ADD CONSTRAINT `galeria_ibfk_1` FOREIGN KEY (`fk_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`fk_rol`) REFERENCES `roles` (`id_rol`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`fk_genero`) REFERENCES `generos` (`id_genero`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `usuarios_ibfk_3` FOREIGN KEY (`fk_provincia`) REFERENCES `provincias` (`id_provincia`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
