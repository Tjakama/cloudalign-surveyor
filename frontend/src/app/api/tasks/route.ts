import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch all tasks or a specific task
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('id');

    if (taskId) {
      const task = await prisma.task.findUnique({
        where: { id: taskId },
      });
      if (!task) {
        return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, task });
    }

    const tasks = await prisma.task.findMany({
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ success: true, tasks });
  } catch (error: any) {
    console.error('Failed to fetch tasks:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Create and dispatch a new survey task
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      title, 
      clientName, 
      siteName, 
      location, 
      contactPerson, 
      contactPhone, 
      surveyType, 
      surveyor, 
      status 
    } = body;

    const newTask = await prisma.task.create({
      data: {
        title: title || `${surveyType || 'Survey'} - ${clientName || 'Site'}`,
        clientName: clientName || '',
        siteName: siteName || clientName || '',
        surveyor: surveyor || '',
        status: status || 'PENDING_REVIEW',
        surveyData: {
          clientName,
          siteName,
          location,
          contactPerson,
          contactPhone,
          surveyType: surveyType || 'Solar & Power Audit',
          materialsBOM: [],
        },
      },
    });

    return NextResponse.json({ success: true, task: newTask });
  } catch (error: any) {
    console.error('Failed to create task:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH: Update task details, status, and surveyData JSON payload
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { 
      id, 
      clientName, 
      siteName, 
      location, 
      contactPerson, 
      contactPhone, 
      status, 
      surveyData 
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Task ID is required' }, { status: 400 });
    }

    const extractedClient = clientName || surveyData?.clientName;
    const extractedSite = siteName || surveyData?.siteName || extractedClient;

    // Merge existing surveyData with any new updates
    const existingTask = await prisma.task.findUnique({ where: { id } });
    const currentSurveyData = (existingTask?.surveyData as object) || {};

    const updatedSurveyData = surveyData ? {
      ...currentSurveyData,
      ...surveyData,
      ...(location && { location }),
      ...(contactPerson && { contactPerson }),
      ...(contactPhone && { contactPhone }),
    } : currentSurveyData;

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...(extractedClient !== undefined && { clientName: extractedClient }),
        ...(extractedSite !== undefined && { siteName: extractedSite }),
        ...(status !== undefined && { status }),
        surveyData: updatedSurveyData,
      },
    });

    return NextResponse.json({ success: true, task: updatedTask });
  } catch (error: any) {
    console.error('Failed to update task via PATCH:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}