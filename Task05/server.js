import express from 'express';
import cors from 'cors';
import pg from 'pg';

const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'communication_services',
  port: 5432
});

const app = express();
app.use(express.json());
app.use(cors());

class ServicesController {

  async getServices(req, res) {
    try {
      const services = await pool.query('SELECT * FROM services');
      res.json(services.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching services' });
    }
  }


  async addService(req, res) {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    try {
      const newService = await pool.query(
          'INSERT INTO services (name, description) VALUES ($1, $2) RETURNING *',
          [name, description]
      );
      res.status(201).json(newService.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error adding service' });
    }
  }


  async updateService(req, res) {
    const { id } = req.params;
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const serviceId = parseInt(id, 10);
    if (isNaN(serviceId)) {
      return res.status(400).json({ error: 'Invalid service ID' });
    }

    try {
      const updatedService = await pool.query(
          'UPDATE services SET name = $1, description = $2 WHERE id = $3 RETURNING *',
          [name, description, serviceId]
      );
      if (updatedService.rows.length > 0) {
        res.json(updatedService.rows[0]);
      } else {
        res.status(404).json({ error: 'Service not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating service' });
    }
  }


  async deleteService(req, res) {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid service ID' });
    }

    const serviceId = parseInt(id, 10);

    try {
      const result = await pool.query('DELETE FROM services WHERE id = $1', [serviceId]);
      if (result.rowCount > 0) {
        res.json({ message: 'Service deleted successfully' });
      } else {
        res.status(404).json({ error: 'Service not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting service' });
    }
  }
}

class DevicesController {

  async getDevices(req, res) {
    try {
      const devices = await pool.query('SELECT * FROM device');
      res.json(devices.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching devices' });
    }
  }


  async addDevice(req, res) {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    try {
      const newDevice = await pool.query(
          'INSERT INTO device (name) VALUES ($1) RETURNING *',
          [name]
      );
      res.status(201).json(newDevice.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error adding device' });
    }
  }


  async updateDevice(req, res) {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const device_id = parseInt(id, 10);
    if (isNaN(device_id)) {
      return res.status(400).json({ error: 'Invalid device ID' });
    }

    try {
      const updatedDevice = await pool.query(
          'UPDATE device SET name = $1 WHERE id = $2 RETURNING *',
          [name, device_id]
      );
      if (updatedDevice.rows.length > 0) {
        res.json(updatedDevice.rows[0]);
      } else {
        res.status(404).json({ error: 'Device not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating device' });
    }
  }


  async deleteDevice(req, res) {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid device ID' });
    }

    const device_id = parseInt(id, 10);

    try {
      const result = await pool.query('DELETE FROM device WHERE id = $1', [device_id]);
      if (result.rowCount > 0) {
        res.json({ message: 'Device deleted successfully' });
      } else {
        res.status(404).json({ error: 'Device not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting device' });
    }
  }
}

class CustomersController {

  async getCustomers(req, res) {
    try {
      const customer = await pool.query('SELECT * FROM customer');
      res.json(customer.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching customer' });
    }
  }


  async addCustomer(req, res) {
    const { name, surname, email, tariff_id } = req.body;
    if (!name || !surname || !surname || !tariff_id) {
      return res.status(400).json({ error: 'Name, surname, email and tariff_id are required' });
    }

    try {
      const newCustomer = await pool.query(
        'INSERT INTO customer (name, surname, email, tariff_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, surname, email, tariff_id]
      );
      res.status(201).json(newCustomer.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error adding customer' });
    }
  }


  async updateCustomer(req, res) {
    const { id } = req.params;
    const { name, surname, email, tariff_id } = req.body;
    if (!name || !surname || !email || !tariff_id) {
      return res.status(400).json({ error: 'Name, surname, email and tariff_id are required' });
    }

    const customerId = parseInt(id, 10);
    if (isNaN(customerId)) {
      return res.status(400).json({ error: 'Invalid customer ID' });
    }

    try {
      const updatedCustomer = await pool.query(
        'UPDATE customer SET name = $1, surname = $2, email = $3, tariff_id = $4 WHERE id = $5 RETURNING *',
        [name, surname, email, tariff_id, customerId]
      );
      if (updatedCustomer.rows.length > 0) {
        res.json(updatedCustomer.rows[0]);
      } else {
        res.status(404).json({ error: 'Customer not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating customer' });
    }
  }


  async deleteCustomer(req, res) {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid customer ID' });
    }

    const customerId = parseInt(id, 10);

    try {
      const result = await pool.query('DELETE FROM customer WHERE id = $1', [customerId]);
      if (result.rowCount > 0) {
        res.json({ message: 'Client deleted successfully' });
      } else {
        res.status(404).json({ error: 'Client not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting customer' });
    }
  }
}

class TariffsController {
  // Получить список всего транспорта
  async getTariffs(req, res) {
    try {
      const tariffs = await pool.query('SELECT * FROM tariffs');
      res.json(tariffs.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching tariffs' });
    }
  }

  // Добавить новый транспорт
  async addTariff(req, res) {
    const { name, description, services_id, device_id, price } = req.body;
    if (!name || !description || !services_id || !device_id || !price) {
      return res.status(400).json({ error: 'Name, description, services_id, device_id and price are required' });
    }

    try {
      const newTariff = await pool.query(
        'INSERT INTO tariffs (name, description, services_id, device_id, price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, description, services_id, device_id, price]
      );
      res.status(201).json(newTariff.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error adding tariff' });
    }
  }

  // Обновить существующий транспорт
  async updateTariff(req, res) {
    const { id } = req.params;
    const { name, description, services_id, device_id, price } = req.body;
    if (!name || !description || !services_id || !device_id || !price) {
      return res.status(400).json({ error: 'Name, description, services_id, device_id and price are required' });
    }

    const tariff_id = parseInt(id, 10);
    if (isNaN(tariff_id)) {
      return res.status(400).json({ error: 'Invalid tariff_id ID' });
    }

    try {
      const updatedTariff = await pool.query(
        'UPDATE tariffs SET name = $1, description = $2, services_id = $3, device_id = $4, price = $5 WHERE id = $6 RETURNING *',
        [name, description, services_id, device_id, price, tariff_id]
      );
      if (updatedTariff.rows.length > 0) {
        res.json(updatedTariff.rows[0]);
      } else {
        res.status(404).json({ error: 'Tariff not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating tariff' });
    }
  }

  // Удалить транспорт
  async deleteTariff(req, res) {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid tariff ID' });
    }

    const tariff_id = parseInt(id, 10);

    try {
      const result = await pool.query('DELETE FROM tariffs WHERE id = $1', [tariff_id]);
      if (result.rowCount > 0) {
        res.json({ message: 'Tariff deleted successfully' });
      } else {
        res.status(404).json({ error: 'Tariff not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting Tariff' });
    }
  }
}

const servicesController = new ServicesController();
const devicesController = new DevicesController();
const customersController = new CustomersController();
const taiffsController = new TariffsController();

app.get('/services', (req, res) => servicesController.getServices(req, res));
app.post('/service', (req, res) => servicesController.addService(req, res));
app.put('/service/:id', (req, res) => servicesController.updateService(req, res));
app.delete('/service/:id', (req, res) => servicesController.deleteService(req, res));

app.get('/devices', (req, res) => devicesController.getDevices(req, res));
app.post('/device', (req, res) => devicesController.addDevice(req, res));
app.put('/device/:id', (req, res) => devicesController.updateDevice(req, res));
app.delete('/device/:id', (req, res) => devicesController.deleteDevice(req, res));

app.get('/customers', (req, res) => customersController.getCustomers(req, res));
app.post('/customer', (req, res) => customersController.addCustomer(req, res));
app.put('/customer/:id', (req, res) => customersController.updateCustomer(req, res));
app.delete('/customer/:id', (req, res) => customersController.deleteCustomer(req, res));

app.get('/tariffs', (req, res) => taiffsController.getTariffs(req, res));
app.post('/tariff', (req, res) => taiffsController.addTariff(req, res));
app.put('/tariff/:id', (req, res) => taiffsController.updateTariff(req, res));
app.delete('/tariff/:id', (req, res) => taiffsController.deleteTariff(req, res));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
