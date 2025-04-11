import React from 'react';
import { Card } from 'react-bootstrap';
import './StatCard.css';

interface StatCardProps {
  title: string;
  value: string | number;
  footer?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, footer }) => (
  <Card className="text-center shadow-sm">
    <Card.Body>
      <Card.Title>{title}</Card.Title>
      <Card.Text className="display-6 fw-bold">{value}</Card.Text>
    </Card.Body>
    {footer && <Card.Footer className="text-muted">{footer}</Card.Footer>}
  </Card>
);

export default StatCard;