'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { SecurityLog } from '@/lib/types';
import { Globe2, Crosshair, AlertCircle } from 'lucide-react';

interface ThreatMapProps {
  logs: SecurityLog[];
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  severity: string;
  threat: string;
  sourceType: string;
  id: string;
}

export default function ThreatMap({ logs }: ThreatMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [hoveredParticle, setHoveredParticle] = useState<Particle | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = dimensions.width * window.devicePixelRatio;
    canvas.height = dimensions.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const particles: Particle[] = [];
    const connections: Array<[Particle, Particle]> = [];

    // Create particles from logs
    logs.slice(-30).forEach((log, i) => {
      const angle = (i / 30) * Math.PI * 2;
      const distance = 50 + Math.random() * (Math.min(dimensions.width, dimensions.height) * 0.3);
      
      particles.push({
        x: dimensions.width / 2 + Math.cos(angle) * distance,
        y: dimensions.height / 2 + Math.sin(angle) * distance,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: log.event.severity === 'critical' ? 8 : 
                log.event.severity === 'high' ? 6 : 4,
        color: log.event.severity === 'critical' ? '#ef4444' :
               log.event.severity === 'high' ? '#f97316' :
               log.event.severity === 'medium' ? '#eab308' : '#21E6C1',
        severity: log.event.severity,
        threat: log.threat.name,
        sourceType: log.source_type,
        id: log.id
      });
    });

    // Create connections for related threats
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        if (p1.sourceType === p2.sourceType || p1.severity === p2.severity) {
          connections.push([p1, p2]);
        }
      });
    });

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      let found = false;
      particles.forEach(particle => {
        const dx = particle.x - x;
        const dy = particle.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < particle.radius + 5) {
          setHoveredParticle(particle);
          found = true;
        }
      });
      if (!found) setHoveredParticle(null);
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(10, 14, 27, 0.1)';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Draw center point
      ctx.beginPath();
      ctx.arc(dimensions.width / 2, dimensions.height / 2, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#21E6C1';
      ctx.fill();

      // Draw grid lines from center
      ctx.strokeStyle = 'rgba(33, 230, 193, 0.1)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(dimensions.width / 2, dimensions.height / 2);
        ctx.lineTo(
          dimensions.width / 2 + Math.cos(angle) * dimensions.width,
          dimensions.height / 2 + Math.sin(angle) * dimensions.height
        );
        ctx.stroke();
      }

      // Draw connections
      connections.forEach(([p1, p2]) => {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(33, 230, 193, ${0.2 * (1 - distance / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });

      // Update and draw particles
      particles.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off walls
        if (particle.x < particle.radius || particle.x > dimensions.width - particle.radius) {
          particle.vx *= -1;
        }
        if (particle.y < particle.radius || particle.y > dimensions.height - particle.radius) {
          particle.vy *= -1;
        }

        // Keep particles in bounds
        particle.x = Math.max(particle.radius, Math.min(dimensions.width - particle.radius, particle.x));
        particle.y = Math.max(particle.radius, Math.min(dimensions.height - particle.radius, particle.y));

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Glow effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius * 3
        );
        gradient.addColorStop(0, particle.color + '40');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Pulse effect for critical threats
        if (particle.severity === 'critical') {
          const pulse = Math.sin(Date.now() * 0.003) * 0.5 + 0.5;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius + pulse * 10, 0, Math.PI * 2);
          ctx.strokeStyle = particle.color + '40';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [logs, dimensions]);

  return (
    <div className="cyber-card h-[300px]">
      <div className="flex items-center gap-3 mb-4">
        <Globe2 className="w-6 h-6 text-soar-bright" />
        <h3 className="text-lg font-semibold text-white">Threat Visualization</h3>
        <div className="flex-1" />
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Crosshair className="w-3 h-3" />
          <span>Real-time threat mapping</span>
        </div>
      </div>
      
      <div className="relative h-[240px] rounded-lg overflow-hidden bg-cyber-gray/50">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair"
          style={{ width: '100%', height: '100%' }}
        />
        
        {/* Hover tooltip */}
        {hoveredParticle && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute z-10 pointer-events-none"
            style={{
              left: hoveredParticle.x,
              top: hoveredParticle.y,
              transform: 'translate(-50%, -120%)'
            }}
          >
            <div className="bg-gray-900 border border-soar-medium/50 rounded-lg p-3 shadow-xl">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className={`w-4 h-4 ${
                  hoveredParticle.severity === 'critical' ? 'text-red-500' :
                  hoveredParticle.severity === 'high' ? 'text-orange-500' :
                  'text-yellow-500'
                }`} />
                <span className="text-xs font-semibold text-white">{hoveredParticle.threat}</span>
              </div>
              <div className="text-xs text-gray-400">
                <div>Source: {hoveredParticle.sourceType}</div>
                <div>Severity: {hoveredParticle.severity}</div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-gray-400">Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-gray-400">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-soar-bright" />
            <span className="text-gray-400">Low</span>
          </div>
        </div>

        {/* Scan effect overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="scan-line animate-scan opacity-30" />
        </div>
      </div>
    </div>
  );
}