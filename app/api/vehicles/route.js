import { NextResponse } from 'next/server';
import { createVehicle, getUserVehicles, getVehicleById, updateVehicle } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth';

export async function POST(request) {
  try {
    const { userId, registration, make, model, year, motDueDate, taxDueDate, insuranceDueDate } = await request.json();

    // Validate required fields
    if (!userId || !registration) {
      return NextResponse.json(
        { error: 'User ID and registration are required' },
        { status: 400 }
      );
    }

    // Format registration (remove spaces, uppercase)
    const formattedRegistration = registration.replace(/\s/g, '').toUpperCase();

    // Create vehicle
    const vehicle = await createVehicle(userId, {
      registration: formattedRegistration,
      make,
      model,
      year,
      motDueDate,
      taxDueDate,
      insuranceDueDate
    });

    return NextResponse.json({
      success: true,
      message: 'Vehicle added successfully',
      vehicle: {
        id: vehicle.id,
        registration: vehicle.registration,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        motDueDate: vehicle.mot_due_date,
        taxDueDate: vehicle.tax_due_date,
        insuranceDueDate: vehicle.insurance_due_date,
        createdAt: vehicle.created_at
      }
    });

  } catch (error) {
    console.error('Vehicle creation error:', error);
    return NextResponse.json(
      { error: 'Failed to add vehicle', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const vehicleId = searchParams.get('id');

    if (vehicleId) {
      // Get specific vehicle
      const vehicle = await getVehicleById(vehicleId);
      
      if (!vehicle) {
        return NextResponse.json(
          { error: 'Vehicle not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        vehicle: {
          id: vehicle.id,
          registration: vehicle.registration,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          motDueDate: vehicle.mot_due_date,
          taxDueDate: vehicle.tax_due_date,
          insuranceDueDate: vehicle.insurance_due_date,
          createdAt: vehicle.created_at,
          updatedAt: vehicle.updated_at
        }
      });
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user's vehicles
    const vehicles = await getUserVehicles(userId);

    return NextResponse.json({
      success: true,
      vehicles: vehicles.map(vehicle => ({
        id: vehicle.id,
        registration: vehicle.registration,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        motDueDate: vehicle.mot_due_date,
        taxDueDate: vehicle.tax_due_date,
        insuranceDueDate: vehicle.insurance_due_date,
        createdAt: vehicle.created_at,
        updatedAt: vehicle.updated_at
      }))
    });

  } catch (error) {
    console.error('Vehicle retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to get vehicles', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { id, updates } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Vehicle ID is required' },
        { status: 400 }
      );
    }

    // Format registration if it's being updated
    if (updates.registration) {
      updates.registration = updates.registration.replace(/\s/g, '').toUpperCase();
    }

    const updatedVehicle = await updateVehicle(id, updates);

    return NextResponse.json({
      success: true,
      message: 'Vehicle updated successfully',
      vehicle: {
        id: updatedVehicle.id,
        registration: updatedVehicle.registration,
        make: updatedVehicle.make,
        model: updatedVehicle.model,
        year: updatedVehicle.year,
        motDueDate: updatedVehicle.mot_due_date,
        taxDueDate: updatedVehicle.tax_due_date,
        insuranceDueDate: updatedVehicle.insurance_due_date,
        updatedAt: updatedVehicle.updated_at
      }
    });

  } catch (error) {
    console.error('Vehicle update error:', error);
    return NextResponse.json(
      { error: 'Failed to update vehicle', details: error.message },
      { status: 500 }
    );
  }
} 